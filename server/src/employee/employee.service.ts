import camelcaseKeys from "camelcase-keys";
import { employeeRepository } from "./employee.repository";

class EmployeeService {
  async getEmployeeList() {
    const dbResult = await employeeRepository.getEmployeeList();
    if (!dbResult) return;
    return camelcaseKeys(dbResult ?? [], { deep: true });
  }

  async getEmployeeSummary() {
    const data = await this.getEmployeeList();

    const summary = data?.reduce((acc, curr) => {
      const role = curr.employeeRole;

      acc.employeeCount = (acc.employeeCount || 0) + 1;
      acc[role] = (acc[role] || 0) + 1;

      return acc;
    }, {});

    return summary;
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

  async addEmployee(employeeData: any) {
    const dbData = {
      full_name: employeeData.fullName,
      employee_role: employeeData.employeeRole,
      shift_start: employeeData.shiftStart,
      shift_end: employeeData.shiftEnd,
      shift_day: employeeData.shiftDay,
      pin: employeeData.pin,
      image_url: employeeData.imageUrl,
    };
    const result = await employeeRepository.addEmployee(dbData);
    return camelcaseKeys(result ?? {}, { deep: true });
  }

  async updateEmployee(employeeId: string, employeeData: any) {
    const dbData: any = {};
    if (employeeData.fullName) dbData.full_name = employeeData.fullName;
    if (employeeData.employeeRole)
      dbData.employee_role = employeeData.employeeRole;
    if (employeeData.shiftStart) dbData.shift_start = employeeData.shiftStart;
    if (employeeData.shiftEnd) dbData.shift_end = employeeData.shiftEnd;
    if (employeeData.shiftDay) dbData.shift_day = employeeData.shiftDay;
    if (employeeData.pin !== undefined) dbData.pin = employeeData.pin;
    if (employeeData.imageUrl !== undefined)
      dbData.image_url = employeeData.imageUrl;

    const result = await employeeRepository.updateEmployee(employeeId, dbData);
    return camelcaseKeys(result ?? {}, { deep: true });
  }

  async deleteEmployee(employeeId: string) {
    return await employeeRepository.deleteEmployee(employeeId);
  }
}

export const employeeService = new EmployeeService();
