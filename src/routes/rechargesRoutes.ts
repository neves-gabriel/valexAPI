import { Router } from "express";
import validateApiKey from "../middlewares/validateApiKeyMiddleware";
import { validateSchema } from "../middlewares/validateSchemaMiddleware";
import schemas from "../schemas/index";
import * as controller from "../controllers/rechargesController";

const rechargesRoutes = Router();

rechargesRoutes.post(
  "/recharges",
  validateApiKey,
  validateSchema(schemas.createRechargeSchema),
  controller.createRecharge,
);

export default rechargesRoutes;
