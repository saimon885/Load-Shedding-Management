import { NotificationType } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const createNotification = async (
  userId: string,
  message: string,
  type: NotificationType,
) => {
  return await prisma.notification.create({
    data: { userId, message, type },
  });
};

export const createBulkNotifications = async (
  userIds: string[],
  message: string,
  type: NotificationType,
) => {
  if (!userIds || userIds.length === 0) return;

  const notificationsData = userIds.map((userId) => ({
    userId,
    message,
    type,
  }));

  return await prisma.notification.createMany({
    data: notificationsData,
  });
};
