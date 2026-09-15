import {
  AssignmentStatus,
  NotificationType,
  OutageStatus,
  ReportStatus,
  UserRole,
} from "../../generated/prisma/enums";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import {
  createBulkNotifications,
  createNotification,
} from "../notification/notificaton.helper";
import { sendOutageAlertEmail } from "../../utility/sendEmailOutage";
import { sendRestoredAlertEmail } from "../../utility/sendRestoredAlertEmail";

const createAssignment = async (payload: {
  outageId: string;
  technicianId: string;
}) => {
  const { outageId, technicianId } = payload;

  const outage = await prisma.outage.findUnique({
    where: { id: outageId },
  });

  if (!outage) {
    throw new AppError(httpStatus.NOT_FOUND, "Outage not found!");
  }

  if (
    outage.status === OutageStatus.RESTORED ||
    outage.status === OutageStatus.CANCELLED
  ) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Cannot assign a technician to a resolved or cancelled outage!",
    );
  }

  const technician = await prisma.user.findFirst({
    where: { id: technicianId, role: UserRole.TECHNICIAN },
  });

  if (!technician) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "this is not a technician. please valid technician id",
    );
  }

  const existingActiveAssign = await prisma.technicianAssign.findFirst({
    where: {
      outageId,
      technicianId,
      status: {
        in: [
          AssignmentStatus.PENDING,
          AssignmentStatus.IN_PROGRESS,
          AssignmentStatus.ACCEPTED,
        ],
      },
    },
  });

  if (existingActiveAssign) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This technician is already actively assigned to this outage!",
    );
  }
  const result = await prisma.technicianAssign.create({
    data: {
      outageId,
      technicianId,
      status: AssignmentStatus.PENDING,
    },
    include: {
      outage: true,
      technician: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  await createNotification(
    result.technicianId,
    `You have been assigned to fix an outage (ID: ${result.outageId}).`,
    "ASSIGNMENT_ALERT",
  );

  return result;
};

const getAllTechnician = async () => {
  const result = await prisma.user.findMany({
    where: {
      role: "TECHNICIAN",
    },
    omit: {
      password: true,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "technician not found");
  }
  return result;
};

const updateAssignmentStatus = async (
  assignmentId: string,
  newStatus: AssignmentStatus,
  currentUserId: string,
  currentUserRole: string,
) => {
  const assignment = await prisma.technicianAssign.findUnique({
    where: { id: assignmentId },
    include: { outage: true },
  });

  if (!assignment) {
    throw new AppError(httpStatus.NOT_FOUND, "Assignment not found!");
  }

  if (
    currentUserRole === "TECHNICIAN" &&
    assignment.technicianId !== currentUserId
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this assignment!",
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const now = new Date();

    const updatedAssignment = await tx.technicianAssign.update({
      where: { id: assignmentId },
      data: {
        status: newStatus,
        ...(newStatus === AssignmentStatus.COMPLETED && { resolvedAt: now }),
      },
    });
    if (newStatus === AssignmentStatus.IN_PROGRESS) {
      await tx.outage.update({
        where: { id: assignment.outageId },
        data: {
          restorationStartedAt: now,
        },
      });
    }

    if (newStatus === AssignmentStatus.COMPLETED) {
      const restoredOutage = await tx.outage.update({
        where: { id: assignment.outageId },
        data: {
          status: OutageStatus.RESTORED,
          actualRestorationTime: now,
        },
      });
      await tx.outageReport.updateMany({
        where: {
          outageId: assignment.outageId,
        },
        data: {
          status: ReportStatus.RESOLVED,
        },
      });
      if (restoredOutage?.areaId) {
        const areaCustomers = await tx.user.findMany({
          where: {
            areaId: restoredOutage.areaId,
            // role: UserRole.CUSTOMER,
          },
          select: { id: true, email: true },
        });

        const customerIds = areaCustomers.map((user) => user.id);

        const customerEmails = areaCustomers
          .map((user) => user.email)
          .filter((email): email is string => Boolean(email));

        if (customerIds.length > 0) {
          await createBulkNotifications(
            customerIds,
            "Power has been successfully restored in your area.",
            NotificationType.RESTORED_ALERT,
          );
        }

        if (customerEmails.length > 0) {
          const area = await tx.area.findUnique({
            where: { id: restoredOutage.areaId },
            select: { name: true },
          });
          await sendRestoredAlertEmail({
            emails: customerEmails,
            areaName: area?.name || "Your Area",
            restorationTime: restoredOutage.actualRestorationTime
              ? restoredOutage.actualRestorationTime.toString()
              : new Date().toString(),
            restorationNote:
              restoredOutage.restorationNote ||
              "Power has been successfully restored in your area.",
          });
        }
      }
    }

    return updatedAssignment;
  });

  return result;
};
export const assignmentService = {
  createAssignment,
  getAllTechnician,
  updateAssignmentStatus,
};
