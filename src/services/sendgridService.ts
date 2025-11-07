import sgMail from "@sendgrid/mail";
import fs from "fs";

console.log("SendGrid API Key:", process.env.SENDGRID_API_KEY); // Línea de depuración
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

const pathToTemplate = "./src/constants/reporte_tralma.pdf";

const attachment = fs.readFileSync(pathToTemplate).toString("base64");

export const handleSendEmail = async (to: string) => {
	try {
		const msg = {
			to,
			from: "no-reply@circulariachile.cl", // debe estar verificado en SendGrid
			subject: "Reporte de CircularIA",
			text: "Adjunto encontrarás el reporte solicitado de CircularIA.",
			attachments: [
				{
					content: attachment,
					filename: "reporte_tralma_corp.pdf",
					type: "application/pdf",
					disposition: "attachment",
				},
			],
		};

		await sgMail.send(msg);
		console.log("Email sent successfully");
	} catch (error: any) {
		console.error("Error sending email:", error.response?.body || error);
		throw error;
	}
};
