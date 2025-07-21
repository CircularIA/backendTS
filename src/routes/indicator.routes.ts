import {
	getIndicatorInfo,
	getIndicators,
	getIndicatorValue,
} from "@src/controllers/indicator";
import { PermissionError } from "@src/errors/PermissionError";
import { verifyToken } from "@src/middlewares/auth";
import { checkPermission } from "@src/middlewares/checkPermission";
import {
	Actions,
	createFormatPermission,
	getResourceByRole,
	Resources,
} from "@src/types/permission.types";
import { Router } from "express";

const indicatorRouter = Router();

indicatorRouter.get(
	"/branch/:branchId",
	verifyToken,
	checkPermission(createFormatPermission(Resources.INDICATORS, Actions.READ)),
	getIndicators
);

indicatorRouter.get(
	"/branch/info/:indicatorId",
	verifyToken,
	checkPermission(createFormatPermission(Resources.INDICATORS, Actions.READ)),
	getIndicatorInfo
);

indicatorRouter.get(
	"/values/:branch/:indicator/:year/:month?",
	verifyToken,
	checkPermission((req) => {
		const user = (req as any).user;
		console.log("🚀 ~ checkPermission ~ user:", user);

		const resource = getResourceByRole(user.role);

		if (!resource) {
			throw new PermissionError();
		}
		return createFormatPermission(resource, Actions.READ);
	}),
	getIndicatorValue
);

export default indicatorRouter;
