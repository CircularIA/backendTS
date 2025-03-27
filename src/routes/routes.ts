import authRouter from "./auth.routes";
import userRouter from "./users.routes";
import { Router } from "express";

const router = Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/health", (req, res) => {
	res.status(200).json({ message: "Server is running" });
});

export default router;
