import { Router } from "express";
import * as controller from "../controllers/cardsController";
import validateAPIKey from "../middlewares/validateAPIKeyMiddleware";
import { validateCardID } from "../middlewares/validateCardIDMiddleware";
import validateEmployeeID from "../middlewares/validateEmployeeIdMiddleware";
import { validateSchema } from "../middlewares/validateSchemaMiddleware";
import schemas from "../schemas/index";

const cardsRoutes = Router();

cardsRoutes.get("/cards/:cardId", validateCardID, controller.getCardData);

cardsRoutes.post(
  "/cards",
  validateAPIKey,
  validateSchema(schemas.createCardSchema),
  validateEmployeeID,
  controller.createCard,
);

cardsRoutes.patch(
  "/cards/:cardId/activate",
  validateSchema(schemas.activateCardSchema),
  validateCardID,
  controller.activateCard,
);

export default cardsRoutes;
