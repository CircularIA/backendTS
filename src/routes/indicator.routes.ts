import {
	getIndicatorInfo,
	getIndicators,
	getIndicatorValue,
} from "@src/controllers/indicator";
import { verifyToken } from "@src/middlewares/auth";
import { checkPermissionByRole } from "@src/middlewares/checkPermission";
import { Actions } from "@src/types/permission.types";
import { Router } from "express";

const indicatorRouter = Router();

indicatorRouter.get(
	"/branch/:branchId",
	verifyToken,
	// checkPermission(createFormatPermission(Resources.INDICATORS, Actions.READ)),
	checkPermissionByRole({ action: Actions.READ }),
	getIndicators
);

indicatorRouter.get(
	"/branch/info/:indicatorId",
	verifyToken,
	checkPermissionByRole({
		action: Actions.READ,
	}),
	getIndicatorInfo
);

indicatorRouter.get(
	"/values/:branch/:indicator/:year/:month?",
	verifyToken,
	checkPermissionByRole({ action: Actions.READ }),
	getIndicatorValue
);

export default indicatorRouter;
