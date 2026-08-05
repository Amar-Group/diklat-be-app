import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { roles, users, participant_profiles } from "../../../db/schema";
import { generateToken } from "../../../utils/jwt";
import { LoginResponseDto } from "../dto/user-response.dto";
import { UserReadRepository } from "../repository/user-read.repository";
import { sendOtpEmail } from "../../../utils/mailer";

// Generate a 6-digit OTP
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export class UserAuthService {
  static async login(
    email: string,
    password: string,
  ): Promise<LoginResponseDto | null | { success: false; message: string }> {
    const user = await UserReadRepository.getUserByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // Cek apakah akun terverifikasi (khusus peserta)
    if (user.is_verified === false) {
      return { success: false, message: "Email belum diverifikasi. Silakan periksa email Anda untuk kode OTP." };
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role_id: user.role_id,
      role_code: (user as any).role_code,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role_id: user.role_id,
        role_code: (user as any).role_code,
      },
    };
  }

  static async registerParticipant(payload: any) {
    const { name, email, phone_number, password } = payload;

    // 1. Check if email already exists
    const existingUser = await UserReadRepository.getUserByEmail(email);
    if (existingUser) {
      return { success: false, message: "Email already exists" };
    }

    // 2. Hash password & Generate OTP
    const hashedPassword = await hash(password, 10);
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // 3. Get PARTICIPANT role
    const participantRole = await db.select().from(roles).where(eq(roles.code, "PARTICIPANT")).limit(1);
    if (!participantRole.length) {
      return { success: false, message: "Role PARTICIPANT not found in database" };
    }
    const roleId = participantRole[0].id;

    // 4. Insert in transaction
    try {
      const result = await db.transaction(async (tx) => {
        const [newUser] = await tx.insert(users).values({
          username: email.split('@')[0] + Math.floor(Math.random() * 1000), // Ensure unique username
          email,
          name,
          password: hashedPassword,
          role_id: roleId,
          is_active: true,
          is_verified: false,
          verification_token: otp,
          token_expires_at: expiresAt,
        }).$returningId();

        await tx.insert(participant_profiles).values({
          user_id: newUser.id,
          phone_number,
        });

        return { id: newUser.id };
      });

      // 5. Send OTP Email asynchronously
      sendOtpEmail(email, otp, name).catch(err => console.error("OTP Send Error:", err));

      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed to register participant: ${error.message}` };
    }
  }

  static async verifyOtp(email: string, otp: string) {
    const userList = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!userList.length) {
      return { success: false, message: "Pengguna tidak ditemukan." };
    }

    const user = userList[0];

    if (user.is_verified) {
      return { success: false, message: "Email ini sudah diverifikasi sebelumnya." };
    }

    if (user.verification_token !== otp) {
      return { success: false, message: "Kode OTP tidak valid." };
    }

    if (!user.token_expires_at || user.token_expires_at < new Date()) {
      return { success: false, message: "Kode OTP telah kedaluwarsa. Silakan minta kode baru." };
    }

    // Update is_verified to true and clear token
    await db.update(users).set({
      is_verified: true,
      verification_token: null,
      token_expires_at: null,
    }).where(eq(users.id, user.id));

    return { success: true, message: "Email berhasil diverifikasi." };
  }

  static async resendOtp(email: string) {
    const userList = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!userList.length) {
      return { success: false, message: "Pengguna tidak ditemukan." };
    }

    const user = userList[0];

    if (user.is_verified) {
      return { success: false, message: "Email ini sudah diverifikasi." };
    }

    const newOtp = generateOtp();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await db.update(users).set({
      verification_token: newOtp,
      token_expires_at: expiresAt,
    }).where(eq(users.id, user.id));

    // Send email
    sendOtpEmail(user.email, newOtp, user.name).catch(err => console.error("Resend OTP Send Error:", err));

    return { success: true, message: "Kode OTP baru telah dikirim ke email Anda." };
  }
}
