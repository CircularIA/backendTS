import {
	getIndicatorInfo,
	getIndicators,
	getIndicatorValue,
} from "@src/controllers/indicator";
import { verifyToken } from "@src/middlewares/auth";
import { Router } from "express";

const indicatorRouter = Router();

indicatorRouter.get("/:indicatorId", verifyToken, getIndicatorInfo);

indicatorRouter.get("/:branchId", verifyToken, getIndicators);

indicatorRouter.get(
	"/values/:branch/:indicator/:year/:month?",
	verifyToken,
	getIndicatorValue
);

export default indicatorRouter;
