import { NextFunction, Request, Response } from "express";
import * as services from "../services/employeesService";
import * as errors from "../errors/index";

export default async function validateEmployeeId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { employeeId }: { employeeId: number } = req.body;
  const { company } = res.locals;

  const employee = await services.getById(employeeId);

  if (company.id !== employee.companyId) throw errors.Unauthorized();

  res.locals.employee = employee;

  next();
}
