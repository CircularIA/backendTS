import {
    getListInputDats,
    createListInputDat,
    updateListInputDat,
    deleteListInputDat,
    getListInputDatsByIndicator,
    getEcoequivalences,
    generateExcelTemplate,
} from "@src/controllers/listInputDat";
import { verifyToken } from "@src/middlewares/auth";
import { Router } from "express";

const listInputDatRouter = Router();

// Specific routes first
// GET /ecoequivalences?subcategory=Salida y valorización de Residuos, Productos y subproductos&year=2024&branch=branchId
listInputDatRouter.get("/ecoequivalences", verifyToken, getEcoequivalences);
listInputDatRouter.get("/indicator/:indicatorId", verifyToken, getListInputDatsByIndicator);
listInputDatRouter.get("/excel-template/:branchId/:userId", verifyToken, generateExcelTemplate);

// Generic routes after
listInputDatRouter.get("/:branch?", verifyToken, getListInputDats);
listInputDatRouter.post("/", verifyToken, createListInputDat);
listInputDatRouter.patch("/:id", verifyToken, updateListInputDat);
listInputDatRouter.delete("/:id", verifyToken, deleteListInputDat);

export default listInputDatRouter;