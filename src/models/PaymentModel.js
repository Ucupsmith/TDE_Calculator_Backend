import prisma from "../../prisma/prismaClient.js";

export const createPayment = async ({ userId, mealplanId, amount, qris_url }) => {
  return await prisma.payment.create({
    data: {
      userId,
      mealplanId,
      amount,
      qris_url,
      status: "pending"
    }
  });
};

export const updatePaymentStatus = async (payment_id, status) => {
  return await prisma.payment.update({
    where: { payment_id },
    data: { status }
  });
};

export const getPaymentById = async (payment_id) => {
  return await prisma.payment.findUnique({
    where: { payment_id }
  });
}; 