import { createPayment, updatePaymentStatus, getPaymentById } from "../models/PaymentModel.js";
import { saveNotification } from "../models/NotificationModel.js";

// Checkout & generate QRIS
export const checkoutMealPlan = async (req, res) => {
  const { userId, mealplanId, amount } = req.body;
  if (!userId || !mealplanId || !amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  // Simpan payment dengan status pending dan url qris (bisa url/gambar statis)
  const qris_url = "https://yourdomain.com/static/qris.jpg"; // atau path lokal/gambar QRIS kamu
  const payment = await createPayment({ userId, mealplanId, amount, qris_url });
  res.status(201).json({
    message: "Checkout success, please scan QRIS to pay",
    payment_id: payment.payment_id,
    qris_url: payment.qris_url
  });
};

// Update status payment (manual/otomatis)
export const confirmPayment = async (req, res) => {
  const { payment_id, status } = req.body;
  if (!payment_id || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const updated = await updatePaymentStatus(payment_id, status);
  // Jika payment success, kirim notifikasi ke user
  if (status === "success") {
    const payment = await getPaymentById(payment_id);
    await saveNotification({
      profileId: payment.userId, // asumsikan profileId = userId, sesuaikan jika beda relasi
      notification_content: `Payment Success! Pembayaran meal plan #${payment.mealplanId} telah diterima.`
    });
  }
  res.json({ message: "Payment status updated", updated });
};

// Get payment detail
export const getPayment = async (req, res) => {
  const { payment_id } = req.params;
  const payment = await getPaymentById(Number(payment_id));
  res.json(payment);
}; 