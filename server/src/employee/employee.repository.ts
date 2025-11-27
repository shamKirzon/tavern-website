import { supabase } from "../lib/supabase-client";

class EmployeeRepository {
  async getEmployeeList() {
    try {
      const { data, error } = await supabase.from("employees").select("*");

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error in repository/getEmployeeList():", error);
    }
  }

  async getCashierName(employeeId: string) {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("full_name")
        .eq("employee_id", employeeId)
        .eq("employee_role", "cashier");

      console.log(data);
      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error in repository/getCashierName():", error);
    }
  }

  async getSecurityName(securityId: string) {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("full_name")
        .eq("employee_id", securityId)
        .eq("employee_role", "security");

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error in repository/getSecurityName():", error);
    }
  }
}

export const employeeRepository = new EmployeeRepository();
