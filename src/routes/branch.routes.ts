import { getBranches } from "@src/controllers/branch";
import { verifyToken } from "@src/middlewares/auth";
import { checkPermission } from "@src/middlewares/checkPermission";
import { authorizeRoles, USER_ROLES } from "@src/middlewares/roles";
import {
	Actions,
	createFormatPermission,
	Resources,
} from "@src/types/permission.types";
import { Router } from "express";

const branchRouter = Router();

branchRouter.get(
	"/",
	verifyToken,
	authorizeRoles(USER_ROLES.USER),
	checkPermission(createFormatPermission(Resources.BRANCHES, Actions.READ)),
	getBranches
);

export default branchRouter;
