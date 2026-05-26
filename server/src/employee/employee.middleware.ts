import { z } from "zod";
import { Request, Response, NextFunction } from "express";

//Schemas:
const getEmployeeNameSchema = z.object({
  employeeId: z.string().uuid(),
  role: z.enum(["cashier", "security"]),
});

export const validategetEmployeeName = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parseResult = getEmployeeNameSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: parseResult.error.format(),
    });
  }
  next();
};
