import { createCompany, getCompanies } from "@src/controllers/company";
import { verifyToken } from "@src/middlewares/auth";
import { checkPermissionByRole } from "@src/middlewares/checkPermission";
import { authorizeRoles, USER_ROLES } from "@src/middlewares/roles";
import { Actions, Resources } from "@src/types/permission.types";
import { Router } from "express";

const companyRouter = Router();

companyRouter.get(
	"/",
	verifyToken,
	authorizeRoles(USER_ROLES.USER),
	// checkPermission(createFormatPermission(Resources.BRANCHES, Actions.READ)),
	checkPermissionByRole({
		action: Actions.READ,
		resourceOverride: Resources.BRANCHES,
	}),
	getCompanies
);

companyRouter.post(
	"/",
	verifyToken,
	authorizeRoles(USER_ROLES.SUPER_ADMIN),
	createCompany
);

export default companyRouter;
