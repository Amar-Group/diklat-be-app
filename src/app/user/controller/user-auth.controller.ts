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
      { success: true, data: result.data, message: "Registration successful" },
      201
    );
  }
}
