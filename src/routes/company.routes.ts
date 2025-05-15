import { getCompanies } from "@src/controllers/company";
import { verifyToken } from "@src/middlewares/auth";
import { Router } from "express";

const companyRouter = Router();

companyRouter.get("/", verifyToken, getCompanies);

export default companyRouter;
