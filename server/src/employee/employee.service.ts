import camelcaseKeys from "camelcase-keys";
import { employeeRepository } from "./employee.repository";

class EmployeeService {
  async getEmployeeList() {
    const dbResult = await employeeRepository.getEmployeeList();
    if (!dbResult) return;
    return camelcaseKeys(dbResult ?? [], { deep: true });
  }

  async getCashierName(employeeId: string, role: "cashier" | "security") {
    let dbResult;

    if (role === "cashier") {
      dbResult = await employeeRepository.getCashierName(employeeId);
    } else {
      dbResult = await employeeRepository.getSecurityName(employeeId);
    }

    if (!dbResult || dbResult.length === 0) return;
    return camelcaseKeys(dbResult[0]?.full_name ?? {});
  }
}

export const employeeService = new EmployeeService();
