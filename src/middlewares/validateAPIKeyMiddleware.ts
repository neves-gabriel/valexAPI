import { NextFunction, Request, Response } from "express";
import * as service from "../services/companyService";
import * as errors from "../errors/index";

export default async function validateAPIKey(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { "x-api-key": key } = req.headers;

  if (Array.isArray(key) || !key) throw errors.Unauthorized();

  const company = await service.getCompany(key);
  if (!company) throw errors.Unauthorized();

  res.locals.company = company;

  next();
}
