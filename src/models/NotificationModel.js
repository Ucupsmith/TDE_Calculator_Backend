import prisma from "../../prisma/prismaclient.js";

// Model notifikasi (opsional, bisa dikembangkan untuk log ke database)
export default {};

export const saveNotificationLog = async ({ profileId, notification_content }) => {
  return await prisma.notification.create({
    data: {
      profileId,
      notification_content,
      notification_date: new Date(),
    },
  });
}; 