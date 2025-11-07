import { sendEmailController } from "@src/controllers/email";
import { Router } from "express";

const emailRoutes = Router();

emailRoutes.post("/send", sendEmailController);

export default emailRoutes;
