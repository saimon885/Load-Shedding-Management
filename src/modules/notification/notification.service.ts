import { prisma } from "../../lib/prisma";

const getMyNotificationsService = async (userId: string) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
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
