import { Router } from "express";
import { generateReport } from "./report.controller";

const router = Router();

router.post("/generate", generateReport);

export default router;
