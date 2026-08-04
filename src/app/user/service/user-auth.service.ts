import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { roles, users, participant_profiles } from "../../../db/schema";
import { generateToken } from "../../../utils/jwt";
import { LoginResponseDto } from "../dto/user-response.dto";
import { UserReadRepository } from "../repository/user-read.repository";

export class UserAuthService {
  static async login(
    email: string,
    password: string,
  ): Promise<LoginResponseDto | null> {
    const user = await UserReadRepository.getUserByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return null;
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

    // 2. Hash password
    const hashedPassword = await hash(password, 10);

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
        }).$returningId();

        await tx.insert(participant_profiles).values({
          user_id: newUser.id,
          phone_number,
        });

        return { id: newUser.id };
      });

      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, message: `Failed to register participant: ${error.message}` };
    }
  }
}
