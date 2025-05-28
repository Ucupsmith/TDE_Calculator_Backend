import prisma from "../../prisma/prismaClient.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

// Konfigurasi pengiriman email
const transporter = nodemailer.createTransport({
  service: 'gmail', // Menggunakan service Gmail sesuai permintaan
  auth: {
    user: process.env.EMAIL_USER, // Mengambil dari .env
    pass: process.env.EMAIL_PASS, // Mengambil dari .env
  },
});

// Logika untuk request reset password
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

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

    // --- Bagian Pengiriman Email ---
    const mailOptions = {
      from: process.env.EMAIL_USER, // Gunakan email pengirim dari .env
      to: user.email,
      subject: 'Password Reset Request', // Subject sesuai permintaan
      text: `Hello ${user.email},

We received a request to reset the password for your account. To proceed, please click the link below:

YOUR_FRONTEND_RESET_PASSWORD_URL?token=${resetToken}

Please make sure to reset your password within 1 hour, as the link will expire after that period. If you did not request this, you can safely ignore this email.

If you need further assistance, feel free to contact our support team.

Thank you.

Best regards,
TDEECalculation Team`, // Isi pesan sesuai template
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

  try {
    // Cari user berdasarkan token reset dan pastikan belum expired
    const user = await prisma.user.findFirst({
      where: {
        reset_token: token,
        reset_token_expiry: { gt: new Date() }, // Pastikan token belum expired
      },
    });

    if (!user) {
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