import { Router } from "express";
import { employeeController } from "./employee.controlller";
import { validategetEmployeeName } from "./employee.middleware";

const employeeRoutes = Router();

employeeRoutes.get("/get-employee-list", employeeController.getEmployeeList);
employeeRoutes.get(
  "/get-employee-summary",
  employeeController.getEmployeeSummary,
);

employeeRoutes.post(
  "/get-employee-name/",
  validategetEmployeeName,
  employeeController.getCashierName,
);

export default employeeRoutes;
