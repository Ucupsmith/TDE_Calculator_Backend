import prisma from "../../prisma/prismaClient.js";

// Model notifikasi (opsional, bisa dikembangkan untuk log ke database)
export default {};

export const saveNotification = async ({ profileId, notification_content }) => {
  return await prisma.notification.create({
    data: {
      profileId,
      notification_content,
      notification_date: new Date(),
    },
  });
};

export const getNotificationsByProfile = async (profileId) => {
  return await prisma.notification.findMany({
    where: { profileId },
    orderBy: { notification_date: "desc" }
  });
};

export const saveNotificationLog = async ({ profileId, notification_content }) => {
  return await prisma.notification.create({
    data: {
      profileId,
      notification_content,
      notification_date: new Date(),
    },
  });
}; 