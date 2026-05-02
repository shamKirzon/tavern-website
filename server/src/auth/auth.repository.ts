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

  async updatePassword(newPassword: string) {
    try {
      const { data: accounts, error: fetchError } = await supabase
        .from("admin_accounts")
        .select("*")
        .limit(1);

      if (fetchError || !accounts || accounts.length === 0) {
        throw fetchError || new Error("No admin account found");
      }

      const username = accounts[0].username;

      const { error: updateError } = await supabase
        .from("admin_accounts")
        .update({ password: newPassword })
        .eq("username", username);

      if (updateError) throw updateError;

      // supabase auth update session
      const {
        data: { users },
        error,
      } = await supabase.auth.admin.listUsers();

      const user = users.find((u) => u.email === username);

      if (!user) {
        throw error;
      }

      // Now use their UID to update password
      // but change first the api key in your settings/api keys/legacy anon.. / service_role
      const { error: updateAuthError } =
        await supabase.auth.admin.updateUserById(user.id, {
          password: newPassword,
        });

      if (updateAuthError) {
        throw updateAuthError;
      }

      return { status: "success" };
    } catch (error) {
      console.error("Error in repository/updatePassword():", error);
      return { status: "error" };
    }
  }
}

export const authRepository = new AuthRepository();
