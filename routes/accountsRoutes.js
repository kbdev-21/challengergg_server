import { Router } from "express";
import { accountsController } from "../controllers/accountsController.js";

const router = Router();

router.get("/api/accounts/by-riotid/:gamename/:tagline",accountsController.getAccount);
router.get("/api/accounts/search", accountsController.searchAccounts);

export default router;
