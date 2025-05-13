import axios from "axios";
import { saveNotification, getNotificationsByProfile } from "../models/NotificationModel.js";

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
    await saveNotification({
      profileId,
      notification_content: `${title} - ${body}`,
    });
    res.json({ message: "Notification sent", response: response.data });
  } catch (error) {
    res.status(500).json({ message: "Failed to send notification", error: error.message });
  }
};

export const createNotification = async (req, res) => {
  const { profileId, notification_content } = req.body;
  if (!profileId || !notification_content) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const notif = await saveNotification({ profileId, notification_content });
    res.status(201).json({ message: "Notification created", notif });
  } catch (error) {
    res.status(500).json({ message: "Failed to create notification", error: error.message });
  }
};

export const getNotifications = async (req, res) => {
  const { profileId } = req.params;
  try {
    const notifs = await getNotificationsByProfile(Number(profileId));
    res.json(notifs);
  } catch (error) {
    res.status(500).json({ message: "Failed to get notifications", error: error.message });
  }
}; 