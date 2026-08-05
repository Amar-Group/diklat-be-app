import { Context } from "hono";
import { LoginRequestDto } from "../dto/user-request.dto";
import { UserAuthService } from "../service/user-auth.service";

export class UserAuthController {
  static async login(c: Context) {
    const body: LoginRequestDto = await c.req.json();
    const loginResult = await UserAuthService.login(body.email, body.password);

    if (!loginResult) {
      return c.json(
        { success: false, message: "Invalid email or password" },
        401,
      );
    }

    if ('success' in loginResult && loginResult.success === false) {
       return c.json(
        { success: false, message: loginResult.message },
        403,
      );
    }

    return c.json({
      success: true,
      data: loginResult,
      message: "Login successful",
    });
  }

  static async registerParticipant(c: Context) {
    const payload = await c.req.json();
    const result = await UserAuthService.registerParticipant(payload);
    
    if (!result.success) {
      return c.json(
        { success: false, message: result.message },
        400
      );
    }
    
    return c.json(
      { success: true, data: result.data, message: "Registration successful. Please verify your email." },
      201
    );
  }

  static async verifyOtp(c: Context) {
    const { email, otp } = await c.req.json();
    if (!email || !otp) {
      return c.json({ success: false, message: "Email and OTP are required" }, 400);
    }

    const result = await UserAuthService.verifyOtp(email, otp);
    if (!result.success) {
      return c.json({ success: false, message: result.message }, 400);
    }

    return c.json({ success: true, message: result.message });
  }

  static async resendOtp(c: Context) {
    const { email } = await c.req.json();
    if (!email) {
      return c.json({ success: false, message: "Email is required" }, 400);
    }

    const result = await UserAuthService.resendOtp(email);
    if (!result.success) {
      return c.json({ success: false, message: result.message }, 400);
    }

    return c.json({ success: true, message: result.message });
  }
}
