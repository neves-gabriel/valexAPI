import { findById } from "../repositories/employeeRepository";
import * as errors from "../errors/index";

export async function getById(employeeId: number) {
  const employee = await findById(employeeId);

  if (!employee) throw errors.NotFound();

  return employee;
}
