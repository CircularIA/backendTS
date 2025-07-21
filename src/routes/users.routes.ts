import {
	createAdmin,
	createAmbientalUser,
	createEconomicUser,
	createSocialUser,
	createSuperAdmin,
} from "../controllers/user";

import { verifyToken } from "@middlewares/auth";
import {
	createRegularUser,
	getUserById,
	getUsersByBranch,
} from "@src/services/userServices";
import { Router } from "express";
const userRouter = Router();

//Get Routes
userRouter.get("/:id", verifyToken, getUserById);
userRouter.get("/branch/:branchId", verifyToken, getUsersByBranch);
//Post Routes
userRouter.post("/createSuperAdmin", createSuperAdmin);
userRouter.post("/createAdmin", verifyToken, createAdmin);
userRouter.post("/createUser", verifyToken, createRegularUser);
userRouter.post("/createAmbientalUser", verifyToken, createAmbientalUser);
userRouter.post("/createEconomicUser", verifyToken, createEconomicUser);
userRouter.post("/createSocialUser", verifyToken, createSocialUser);

export default userRouter;
