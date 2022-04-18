import { Router } from "express";
import * as controller from "../controllers/purchasesController";
import { validateCardID } from "../middlewares/validateCardIDMiddleware";
import { validatePassword } from "../middlewares/validatePasswordMiddleware";
import { validateSchema } from "../middlewares/validateSchemaMiddleware";
import schemas from "../schemas/index";

const purchasesRoutes = Router();

purchasesRoutes.post(
  "/payments",
  validateSchema(schemas.createPurchaseSchema),
  validateCardID,
  validatePassword,
  controller.createPurchase,
);

export default purchasesRoutes;
