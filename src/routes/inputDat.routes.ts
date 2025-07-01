import {
	getInputDats,
	getInputDatsByIndicator,
	registerInputDat,
	registerInputDatsMany,
	getImportProgress,
	getImportHistory,
	checkExistingInputDats,
	importInputDats,
} from "@src/controllers/inputDat";
import { verifyToken } from "@src/middlewares/auth";
import { Router } from "express";

const inputDatRouter = Router();

//GET Routes
inputDatRouter.get('/import/progress', verifyToken, getImportProgress);
inputDatRouter.get('/import/history', verifyToken, getImportHistory);
inputDatRouter.get("/:branch/:year?/:month?/:day?", verifyToken, getInputDats);
inputDatRouter.get(
	"/byIndicator/:branch/:indicator/:year?/:month?/:day?",
	verifyToken,
	getInputDatsByIndicator
);

//Post Routes
inputDatRouter.post('/verify/:company/:branch', verifyToken, checkExistingInputDats);
// Usamos la ruta sin tipado genérico para evitar problemas de compatibilidad
inputDatRouter.post('/import/:company/:branch', verifyToken, importInputDats as any);
inputDatRouter.post("/:company/:branch", verifyToken, registerInputDat);
inputDatRouter.post(
	"/many/:company/:branch",
	verifyToken,
	registerInputDatsMany
);

export default inputDatRouter;
