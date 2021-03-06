import { NextFunction, Request, Response } from "express";
import * as errors from "../errors/index";
import * as repository from "../repositories/cardRepository";

export async function validateCardID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let cardId = Number(req.params.cardId);

  if (!cardId) cardId = req.body.cardId;
  if (!cardId || cardId === NaN || cardId % 1 !== 0) throw errors.NotFound();

  const card = await repository.findById(cardId);
  if (!card) throw errors.NotFound();

  res.locals.card = card;

  next();
}
