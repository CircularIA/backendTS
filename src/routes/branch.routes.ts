import { getBranches } from "@src/controllers/branch";
import { verifyToken } from "@src/middlewares/auth";
import { checkPermissionByRole } from "@src/middlewares/checkPermission";
import { authorizeRoles, USER_ROLES } from "@src/middlewares/roles";
import { Actions, Resources } from "@src/types/permission.types";
import { Router } from "express";

const branchRouter = Router();

branchRouter.get(
	"/",
	verifyToken,
	authorizeRoles(USER_ROLES.USER),
	// checkPermission(createFormatPermission(Resources.BRANCHES, Actions.READ)),
	checkPermissionByRole({
		action: Actions.READ,
		resourceOverride: Resources.BRANCHES,
	}),
	getBranches
);

export default branchRouter;
