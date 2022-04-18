import { Router } from "express";

import cardsRoutes from "./cardsRoutes";
import purchasesRoutes from "./purchasesRoutes";
import rechargesRoutes from "./rechargesRoutes";

const router = Router();

router.use(cardsRoutes);
router.use(purchasesRoutes);
router.use(rechargesRoutes);

export default router;
