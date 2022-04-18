import { Request, Response } from "express";
import * as service from "../services/purchasesServices";

export async function createPurchase(req: Request, res: Response) {
  const purchase = req.body;

  await service.createPurchase(purchase);

  return res.sendStatus(201);
}
