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

  async addEmployee(employeeData: any) {
    try {
      const { data, error } = await supabase
        .from("employees")
        .insert(employeeData)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error("Error in repository/addEmployee():", error);
    }
  }

  async updateEmployee(employeeId: string, employeeData: any) {
    try {
      const { data, error } = await supabase
        .from("employees")
        .update(employeeData)
        .eq("employee_id", employeeId)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error("Error in repository/updateEmployee():", error);
    }
  }

  async deleteEmployee(employeeId: string) {
    try {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("employee_id", employeeId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error in repository/deleteEmployee():", error);
    }
  }
}

export const employeeRepository = new EmployeeRepository();
