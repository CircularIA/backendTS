import { getCompanies } from "@src/controllers/company";
import { Router } from "express";

const companyRouter = Router();

companyRouter.get("/", getCompanies);

export default companyRouter;
