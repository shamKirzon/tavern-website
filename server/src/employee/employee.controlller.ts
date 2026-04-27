import { Request, Response } from "express";
import { employeeService } from "./employee.service";

class EmployeeController {
  async getEmployeeList(req: Request, res: Response) {
    try {
      const result = await employeeService.getEmployeeList();

      if (!result)
        return res
          .status(400)
          .json({ message: "There is no returned employee list. " });

      return res
        .status(200)
        .json({ message: "Fetched employee list successfully. ", result });
    } catch (error: any) {
      console.error("error from getEmployeeList(): ", error);
      return res
        .status(400)
        .json({ message: "Can't get the list of employee" });
    }
  }

  async getEmployeeSummary(req: Request, res: Response) {
    try {
      const result = await employeeService.getEmployeeSummary();

      if (!result)
        return res
          .status(400)
          .json({ message: "There is no returned employee summary. " });

      return res.status(200).json({
        message: "Fetched employee summary successfully. ",
        result,
      });
    } catch (error: any) {
      console.error("error from getEmployeeSummary(): ", error);
      return res.status(400).json({ message: "can't fetch employee summary" });
    }
  }

  async getCashierName(req: Request, res: Response) {
    const { employeeId, role } = req.body;
    try {
      const employeeName = await employeeService.getCashierName(
        employeeId,
        role,
      );

      if (!employeeName)
        return res.status(400).json({ message: `No ${role} name fetched.` });

      return res.status(200).json({ employeeName });
    } catch (error: any) {
      console.error("error from getOrderList(): ", error);
      return res.status(400).json({ message: `Can't get the ${role} name.` });
    }
  }

  async addEmployee(req: Request, res: Response) {
    try {
      const result = await employeeService.addEmployee(req.body);

      if (!result)
        return res.status(400).json({ message: "Can't add employee. " });

      return res
        .status(200)
        .json({ message: "Employee added successfully. ", result });
    } catch (error: any) {
      console.error("error from addEmployee(): ", error);
      return res.status(400).json({ message: "Can't add employee" });
    }
  }

  async updateEmployee(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = await employeeService.updateEmployee(id, req.body);

      if (!result)
        return res.status(400).json({ message: "Can't update employee. " });

      return res
        .status(200)
        .json({ message: "Employee updated successfully. ", result });
    } catch (error: any) {
      console.error("error from updateEmployee(): ", error);
      return res.status(400).json({ message: "Can't update employee" });
    }
  }

  async deleteEmployee(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = await employeeService.deleteEmployee(id);

      if (!result)
        return res.status(400).json({ message: "Can't delete employee. " });

      return res
        .status(200)
        .json({ message: "Employee deleted successfully. " });
    } catch (error: any) {
      console.error("error from deleteEmployee(): ", error);
      return res.status(400).json({ message: "Can't delete employee" });
    }
  }
}

export const employeeController = new EmployeeController();
