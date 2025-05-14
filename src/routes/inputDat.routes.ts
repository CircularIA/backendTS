import {
	getInputDats,
	getInputDatsByIndicator,
	registerInputDat,
	registerInputDatsMany,
} from "@src/controllers/inputDat";
import { verifyToken } from "@src/middlewares/auth";
import { Router } from "express";

const inputDatRouter = Router();

//GET Routes
inputDatRouter.get("/:branch/:year?/:month?/:day?", verifyToken, getInputDats);
inputDatRouter.get(
	"/byIndicator/:branch/:indicator/:year?/:month?/:day?",
	verifyToken,
	getInputDatsByIndicator
);

//Post Routes
inputDatRouter.post("/:company/:branch", verifyToken, registerInputDat);
inputDatRouter.post(
	"/many/:company/:branch",
	verifyToken,
	registerInputDatsMany
);

export default inputDatRouter;
