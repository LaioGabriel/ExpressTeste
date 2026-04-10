import { Router } from "express";
import loginFunction from "./autenticação.ts";
export const router = Router();

router.post("/login", loginFunction);

export default router;