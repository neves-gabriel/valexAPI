import { Request, Response } from "express";
import * as service from "../services/rechargesServices";

export async function createRecharge(req: Request, res: Response) {
  const recharge = req.body;
  const { company } = res.locals;

  await service.createRecharge(recharge, company);

  return res.sendStatus(201);
}
