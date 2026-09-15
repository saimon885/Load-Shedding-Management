import cron from "node-cron";
import { set, format } from "date-fns";
import {
	DayOfWeek,
	NotificationType,
	OutageStatus,
	UserRole,
} from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { createBulkNotifications } from "../modules/notification/notificaton.helper";
import { sendOutageAlertEmail } from "../utility/sendEmailOutage";

const daysMap: any = {
	0: DayOfWeek.SUNDAY,
	1: DayOfWeek.MONDAY,
	2: DayOfWeek.TUESDAY,
	3: DayOfWeek.WEDNESDAY,
	4: DayOfWeek.THURSDAY,
	5: DayOfWeek.FRIDAY,
	6: DayOfWeek.SATURDAY,
};

export const initScheduleCronJob = () => {
	cron.schedule("0 0 * * *", async () => {
		try {
			const today = new Date();
			const currentDayEnum = daysMap[today.getDay()];

			const activeSchedules = await prisma.outageSchedule.findMany({
				where: {
					dayOfWeek: currentDayEnum,
					isActive: true,
				},
				include: {
					area: true,
				},
			});

			for (const schedule of activeSchedules) {
				const [startHour, startMinute] = schedule.startTime
					.split(":")
					.map(Number);
				const [endHour, endMinute] = schedule.endTime.split(":").map(Number);

				const startTime = set(today, {
					hours: startHour,
					minutes: startMinute,
					seconds: 0,
					milliseconds: 0,
				});

				const estimatedRestorationTime = set(today, {
					hours: endHour,
					minutes: endMinute,
					seconds: 0,
					milliseconds: 0,
				});

				const existingOutage = await prisma.outage.findFirst({
					where: {
						areaId: schedule.areaId,
						startTime,
					},
				});

				if (!existingOutage) {
					const newOutage = await prisma.outage.create({
						data: {
							areaId: schedule.areaId,
							feederId: schedule.feederId,
							type: "SCHEDULED",
							status: OutageStatus.SCHEDULED,
							reason: schedule.reason || "Routine Scheduled Load Shedding",
							startTime,
							estimatedRestorationTime,
						},
					});

					const areaCustomers = await prisma.user.findMany({
						where: { areaId: schedule.areaId, role: UserRole.CUSTOMER },
						select: { id: true, email: true },
					});

					const customerIds = areaCustomers.map((u) => u.id);
					const customerEmails = areaCustomers
						.map((u) => u.email)
						.filter((email): email is string => Boolean(email));

					if (customerIds.length > 0) {
						await createBulkNotifications(
							customerIds,
							`Scheduled load shedding today in ({schedule.area.name} from){schedule.startTime} to ${schedule.endTime}.`,
							NotificationType.OUTAGE_ALERT,
						);
					}

					if (customerEmails.length > 0) {
						await sendOutageAlertEmail({
							emails: customerEmails,
							areaName: schedule.area.name,
							type: "SCHEDULED",
							reason: newOutage.reason,
							startTime: format(startTime, "yyyy-MM-dd HH:mm:ss"),
							estimatedRestorationTime: format(
								estimatedRestorationTime,
								"yyyy-MM-dd HH:mm:ss",
							),
						});
					}
				}
			}
		} catch (error) {
			console.error("Error executing Schedule Cron Job:", error);
		}
	});
};
