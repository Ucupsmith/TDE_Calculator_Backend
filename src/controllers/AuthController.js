import prisma from "../../prisma/prismaClient.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

// Konfigurasi pengiriman email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // Mengambil dari .env
  port: process.env.EMAIL_PORT, // Mengambil dari .env
  auth: {
    user: process.env.EMAIL_USER, // Mengambil dari .env
    pass: process.env.EMAIL_PASS, // Mengambil dari .env
  },
});

// Logika untuk request reset password
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // Cari user berdasarkan email menggunakan findFirst
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    console.log('Request Password Reset: User found by email', user ? user.email : 'None'); // Log user email found

    if (!user) {
      // Mengubah respons sesuai permintaan user: email tidak terdaftar
      return res.status(404).json({ message: "Email tidak terdaftar." });
    }

    // Generate token reset yang unik
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // Token berlaku 1 jam

    // Simpan token dan expiry ke database
    await prisma.user.update({
      where: { userId: user.userId },
      data: {
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry,
      },
    });

    console.log('Request Password Reset: Saved token to DB', resetToken); // Log full token saved to DB

    // --- Bagian Pengiriman Email ---
    const mailOptions = {
      from: process.env.EMAIL_FROM, // Gunakan email pengirim dari .env
      to: user.email,
      subject: 'Password Reset Request', // Subject sesuai permintaan
      text: `Hello ${user.email},\n\nKami menerima permintaan reset password untuk akun Anda. Klik link berikut untuk reset password:\n\n${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}\n\nLink berlaku 1 jam. Jika Anda tidak meminta, abaikan email ini.\n\nTerima kasih,\nTDEECalculation Team`, // Isi pesan sesuai template
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        // Handle error pengiriman email jika perlu (misal: log ke file)
        // Namun, respons ke user tetap sukses untuk keamanan (seperti yang sudah kita atur)
      } else {
        console.log('Email sent:', info.response);
      }
    });
    // --- Akhir Bagian Pengiriman Email ---

    // Respons sukses jika email terdaftar dan proses berhasil
    res.status(200).json({ message: "Link reset password telah dikirim ke email Anda." });

  } catch (error) {
    console.error('Error in requestPasswordReset:', error);
    res.status(500).json({ message: "Terjadi kesalahan saat memproses permintaan Anda.", error: error.message });
  }
};

// Logika untuk reset password sebenarnya
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  console.log('Reset Password Attempt: Received token', token);

  try {
    console.log('Reset Password Attempt: Adding a small delay before DB query');
    await new Promise(resolve => setTimeout(resolve, 500)); // Add a 500ms delay
    console.log('Reset Password Attempt: Executing DB query for token', token);
    // Cari user berdasarkan token reset (validasi waktu sementara dimatikan)
    // Menggunakan findFirst karena reset_token mungkin tidak unik untuk findUnique
    const user = await prisma.user.findFirst({
      where: {
        reset_token: token,
      },
    });

    console.log('Reset Password Attempt: DB query result (user object)', user);

    console.log('Reset Password Attempt: User found?', !!user);
    if (user) {
      console.log('Reset Password Attempt: Token in DB (for found user)', user.reset_token); // Log full token in DB
    }

    if (!user) {
      console.log('Reset Password Attempt: Token mismatch or not found');
      return res.status(400).json({ message: "Token reset password tidak valid atau sudah kedaluwarsa." });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 adalah salt rounds

    // Update password dan hapus token reset
    await prisma.user.update({
      where: { userId: user.userId },
      data: {
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
      },
    });

    res.status(200).json({ message: "Password Anda berhasil direset." });

  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: "Terjadi kesalahan saat mereset password Anda.", error: error.message });
  }
}; 