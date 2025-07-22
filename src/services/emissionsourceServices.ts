//Service to create a emission source value

import { ServiceError } from "@src/errors/ServiceError";
import EmissionSourceModel, {
	IEmissionSource,
} from "@src/models/EmissionSource";
import { emissionSourceSchema } from "@src/schemas/emissionSource/emissionSourceSchema";

export const createEmissionSourceValue = async (
	emissionSourceValue: Omit<
		IEmissionSource,
		"id" | "emission_factor" | "unit_factor" | "origin_factor"
	>
) => {
	try {
		const validatedData = emissionSourceSchema
			.omit({ id: true })
			.parse(emissionSourceValue);
		console.log("validated data in emission source type", validatedData);
		const newEmissionSource = new EmissionSourceModel({
			...validatedData,
		});
	} catch (error) {
		throw new ServiceError("Error creating emission source value");
	}
};
