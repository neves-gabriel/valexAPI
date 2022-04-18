import { Request, Response } from "express";
import * as service from "../services/cardsServices";

export async function createCard(req: Request, res: Response) {
  const { cardType } = req.body;
  const { employee } = res.locals;

  const card = await service.create(employee, cardType);

  res.send(card);
}

export async function activateCard(req: Request, res: Response) {
  const { password, securityCode } = req.body;
  const cardId = Number(req.params.cardId);

  await service.activate(securityCode, password, cardId);

  res.send("Card activated");
}

export async function getCardData(res: Response) {
  const {
    card: { id: cardId },
  } = res.locals;

  const data = await service.getData(cardId);

  return res.send(data);
}
