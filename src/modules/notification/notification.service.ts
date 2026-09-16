import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import httpStatus from "http-status";

const getMyNotificationsService = async (userId: string) => {
  const result = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "notification not found");
  }
  return result
};

const markAsReadService = async (notificationId: string, userId: string) => {
  return await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true },
  });
};

const markAllAsReadService = async (userId: string) => {
  return await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

export const notificationService = {
  getMyNotificationsService,
  markAllAsReadService,
  markAsReadService,
};
