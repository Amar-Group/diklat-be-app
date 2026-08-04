import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("=== Menguji Koneksi SMTP ===");
console.log("Host:", process.env.SMTP_HOST);
console.log("Port:", process.env.SMTP_PORT);
console.log("User:", process.env.SMTP_USER ? "***" + process.env.SMTP_USER.substring(3) : "TIDAK ADA");
console.log("Pass:", process.env.SMTP_PASS ? "TERISI" : "KOSONG");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function testConnection() {
  try {
    const success = await transporter.verify();
    if (success) {
      console.log("✅ Server SMTP siap untuk menerima pesan!");
    }
  } catch (error) {
    console.error("❌ Gagal terhubung ke SMTP server:");
    console.error(error);
  }
}

testConnection();
