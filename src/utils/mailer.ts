import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpEmail = async (to: string, otp: string, name: string) => {
  const mailOptions = {
    from: `"Amar Diklat" <${process.env.SMTP_USER}>`,
    to,
    subject: "Kode Verifikasi (OTP) - Pendaftaran Amar Diklat",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #1E1B4B; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Amar Diklat</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="color: #1e293b; margin-top: 0;">Halo, ${name}!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            Terima kasih telah mendaftar di <strong>Amar Diklat</strong>. Untuk menyelesaikan proses pendaftaran Anda, silakan masukkan kode verifikasi (OTP) berikut di halaman pendaftaran:
          </p>
          <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #F97316; letter-spacing: 4px;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            Kode OTP ini hanya berlaku selama <strong>15 menit</strong>. Jangan berikan kode ini kepada siapa pun.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
            Email ini dikirim secara otomatis. Harap tidak membalas email ini.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
};
