import { handleSendEmail } from "@src/services/sendgridService";
import { Request, Response } from "express";

interface SendEmailRequest {
	email: string;
}

export const sendEmailController = async (
	req: Request<Pick<SendEmailRequest, "email">>,
	res: Response
): Promise<Response> => {
	try {
		const { email } = req.body;
		await handleSendEmail(email);
		return res.status(200).json({ message: "Email enviado com sucesso" });
	} catch (error) {
		console.error("Error in sendEmailController:", error);
		return res.status(500).json({ error: "Failed to send email" });
	}
};
