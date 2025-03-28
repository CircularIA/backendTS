import { getBranches } from "@src/controllers/branch";
import { Router } from "express";

const branchRouter = Router();

branchRouter.get("/", getBranches);

export default branchRouter;
