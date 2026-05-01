import { supabase } from "../lib/supabase-client";

class AuthRepository {
  async getAdminAccounts() {
    try {
      const { data, error } = await supabase.from("admin_accounts").select("*");

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error in repository/getAdminAccounts():", error);
      return [];
    }
  }
}

export const authRepository = new AuthRepository();
