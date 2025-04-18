import { getIndicatorInfo, getIndicators } from "@src/controllers/indicator";
import { verifyToken } from "@src/middlewares/auth";
import { Router } from "express";

const indicatorRouter = Router();

indicatorRouter.get("/:indicatorId", verifyToken, getIndicatorInfo);

indicatorRouter.get("/:branchId", verifyToken, getIndicators);

indicatorRouter.get("/values/:branch/:indicator/:year/:month?", verifyToken);

export default indicatorRouter;
