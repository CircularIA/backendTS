import {
	getIndicatorInfo,
	getIndicators,
	getIndicatorValue,
} from "@src/controllers/indicator";
import { verifyToken } from "@src/middlewares/auth";
import { checkPermission } from "@src/middlewares/checkPermission";
import {
	Actions,
	createFormatPermission,
	Resources,
} from "@src/types/permission.types";
import { Router } from "express";

const indicatorRouter = Router();

indicatorRouter.get(
	"/:indicatorId",
	verifyToken,
	checkPermission(createFormatPermission(Resources.INDICATORS, Actions.READ)),
	getIndicatorInfo
);

indicatorRouter.get(
	"/:branchId",
	verifyToken,
	checkPermission(createFormatPermission(Resources.INDICATORS, Actions.READ)),
	getIndicators
);

indicatorRouter.get(
	"/values/:branch/:indicator/:year/:month",
	verifyToken,
	checkPermission(createFormatPermission(Resources.INDICATORS, Actions.READ)),
	getIndicatorValue
);

export default indicatorRouter;
