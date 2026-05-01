import { authRepository } from "./auth.repository";
import { AuthData } from "../types/Auth";

class AuthService {
  async login(authData: AuthData) {
    const accounts = await authRepository.getAdminAccounts();
    const user = accounts.find(
      (acc: any) =>
        acc.username === authData.username && acc.password === authData.password,
    );

    if (!user) return null;

    return { username: user.username };
  }
}

export const authService = new AuthService();
