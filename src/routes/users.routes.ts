import {
	createAdmin,
	createAmbientalUser,
	createEconomicUser,
	createSocialUser,
	createSuperAdmin,
	createUser,
} from "../controllers/user";

import { verifyToken } from "@middlewares/auth";
import { getUserById, getUsersByBranch } from "@services/userService";
import { Router } from "express";
const userRouter = Router();

//Get Routes
userRouter.get("/:id", verifyToken, getUserById);
userRouter.get("/branch/:branchId", verifyToken, getUsersByBranch);
//Post Routes
userRouter.post("/createSuperAdmin", createSuperAdmin);
userRouter.post("/createAdmin", verifyToken, createAdmin);
userRouter.post("/createUser", verifyToken, createUser);
userRouter.post("/createAmbientalUser", verifyToken, createAmbientalUser);
userRouter.post("/createEconomicUser", verifyToken, createEconomicUser);
userRouter.post("/createSocialUser", verifyToken, createSocialUser);

export default userRouter;
