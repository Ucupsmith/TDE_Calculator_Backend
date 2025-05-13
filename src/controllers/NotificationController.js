import axios from "axios";
import { saveNotificationLog } from "../models/NotificationModel.js";

const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY; // simpan di .env

export const sendNotification = async (req, res) => {
  const { title, body, token, profileId } = req.body;
  if (!title || !body || !token || !profileId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const message = {
    notification: {
      title,
      body,
    },
    to: token, // token device/web client
  };

  try {
    const response = await axios.post(
      "https://fcm.googleapis.com/fcm/send",
      message,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `key=${FCM_SERVER_KEY}`,
        },
      }
    );
    // Simpan log ke database
    await saveNotificationLog({
      profileId,
      notification_content: `${title} - ${body}`,
    });
    res.json({ message: "Notification sent", response: response.data });
  } catch (error) {
    res.status(500).json({ message: "Failed to send notification", error: error.message });
  }
}; 