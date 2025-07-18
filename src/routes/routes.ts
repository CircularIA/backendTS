import authRouter from "./auth.routes";
import branchRouter from "./branch.routes";
import companyRouter from "./company.routes";
import indicatorRouter from "./indicator.routes";
import userRouter from "./users.routes";
import listInputDatRouter from "./listInputDat.routes";
import inputDatRouter from "./inputDat.routes";
import { Router } from "express";

const router = Router();

router.use("/user", userRouter);
router.use("/indicator", indicatorRouter);
router.use("/auth", authRouter);
router.use("/branch", branchRouter);
router.use("/company", companyRouter);
router.use("/inputDat", inputDatRouter);
router.use("/listInputDat", listInputDatRouter);
router.use("/health", (req, res) => {
	res.status(200).json({ message: "Server is running" });
});

export default router;
