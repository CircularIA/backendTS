import { IInputDats } from "@src/models/InputDats";

interface IInputDatsAggregate extends IInputDats {
	name: string;
	measurement: string;
}

type detailsType = Record<string, { valor: number; unidad: string }>;

export interface GetValueResult {
	result: number;
	details: detailsType;
}

const getValue = (
	name: string,
	inputDatsValues: IInputDatsAggregate[]
): GetValueResult | undefined => {
	const details: detailsType = {};

	if (name === "Porcentaje valorización ciclo biológico") {
		const valores = {
			generacionLodos: 0,
			valCompostaje: 0,
			valMasa: 0,
			valBiodigestion: 0,
			valTratamientoRiles: 0,
			entradaMunicipal: 0,
		};
		inputDatsValues.forEach((inputDat) => {
			details[inputDat.name] = {
				valor: inputDat.value,
				unidad: inputDat.measurement,
			};
			if (inputDat.name === "Salida compostaje de lodo generado") {
				valores["generacionLodos"] = inputDat.value;
			} else if (inputDat.name === "Salida compostaje") {
				valores["valCompostaje"] = inputDat.value;
			} else if (inputDat.name === "Salida masas") {
				valores["valMasa"] = inputDat.value;
			} else if (inputDat.name === "Salida biodigestión") {
				valores["valBiodigestion"] = inputDat.value;
			} else if (inputDat.name === "Salida RILES tratados") {
				valores["valTratamientoRiles"] = inputDat.value;
			} else if (inputDat.name === "Salida residuos municipales") {
				valores["entradaMunicipal"] = inputDat.value;
			}
		});
		const numerador =
			valores["generacionLodos"] +
			valores["valCompostaje"] +
			valores["valMasa"] +
			valores["valBiodigestion"] +
			valores["valTratamientoRiles"];
		const denominador = numerador + valores["entradaMunicipal"] * 0.6;
		const result = numerador / denominador;
		return { result: result, details };
	} else if (name === "Porcentaje de valorización ciclo técnico") {
		const valores = {
			generacionLodos: 0,
			entradaMunicipal: 0,
			salidaPlastico: 0,
			salidaChatarraFerrosa: 0,
			salidaAluminio: 0,
			salidaTetrapack: 0,
			salidaIncineracionBiomasa: 0,
			salidaReutilizacion: 0,
			salidaPeligrosos: 0,
			salidaInerte: 0,
			entradaCircularAgua: 0,
		};
		inputDatsValues.forEach((inputDat) => {
			details[inputDat.name] = {
				valor: inputDat.value,
				unidad: inputDat.measurement,
			};
			if (inputDat.name === "Salida residuos municipales") {
				valores["entradaMunicipal"] = inputDat.value;
			} else if (inputDat.name === "Salida Plástico") {
				valores["salidaPlastico"] = inputDat.value;
			} else if (inputDat.name === "Salida chatarra ferrosa") {
				valores["salidaChatarraFerrosa"] = inputDat.value;
			} else if (inputDat.name === "Salida aluminio") {
				valores["salidaAluminio"] = inputDat.value;
			} else if (inputDat.name === "Salida tetrapack") {
				valores["salidaTetrapack"] = inputDat.value;
			} else if (inputDat.name === "Salida Incineración de biomasa") {
				valores["salidaIncineracionBiomasa"] = inputDat.value;
			} else if (inputDat.name === "Salida reutilización") {
				valores["salidaReutilizacion"] = inputDat.value;
			} else if (inputDat.name === "Salida peligrosos") {
				valores["salidaPeligrosos"] = inputDat.value;
			} else if (inputDat.name === "Salida inertes") {
				valores["salidaInerte"] = inputDat.value;
			} else if (inputDat.name === "Entrada circular agua") {
				valores["entradaCircularAgua"] = inputDat.value;
			} else if (inputDat.name === "Salida compostaje de lodo generado") {
				valores["generacionLodos"] = inputDat.value;
			}
		});
		//Retornar el valor junto con el factor
		const numerador =
			valores["salidaChatarraFerrosa"] +
			valores["salidaPlastico"] +
			valores["salidaAluminio"] +
			valores["salidaTetrapack"] +
			valores["salidaIncineracionBiomasa"] +
			valores["salidaPeligrosos"];
		const denominador =
			valores["salidaChatarraFerrosa"] +
			valores["salidaPlastico"] +
			valores["salidaAluminio"] +
			valores["salidaTetrapack"] +
			valores["salidaReutilizacion"] +
			valores["salidaPeligrosos"] +
			valores["salidaInerte"] +
			valores["entradaMunicipal"] * 0.6 +
			valores["entradaMunicipal"] *
				(valores["generacionLodos"] - valores["entradaCircularAgua"]);
		const result = numerador / denominador;
		return { result: result, details };
	} else if (name === "Porcentaje circularidad de salida") {
		const valores = {
			generacionLodos: 0,
			salidaCompostaje: 0,
			salidaMasas: 0,
			salidaBiodigestion: 0,
			salidaRiles: 0,
			salidaResiduosMunicipales: 0,
			salidaCartonPapel: 0,
			salidaPlastico: 0,
			salidaChatarraFerrosa: 0,
			salidaAluminio: 0,
			salidaTetrapack: 0,
			salidaIncineracionBiomasa: 0,
			salidaCoproceso: 0,
			salidaReutilizacion: 0,
			salidaPeligrosos: 0,
			salidaInerte: 0,
		};
		inputDatsValues.forEach((inputDat) => {
			details[inputDat.name] = {
				valor: inputDat.value,
				unidad: inputDat.measurement,
			};
			if (inputDat.name === "Salida compostaje de lodo generado") {
				valores["generacionLodos"] += inputDat.value;
			} else if (inputDat.name === "Salida compostaje") {
				valores["salidaCompostaje"] += inputDat.value;
			} else if (inputDat.name === "Salida masas") {
				valores["salidaMasas"] += inputDat.value;
			} else if (inputDat.name === "Salida biodigestión") {
				valores["salidaBiodigestion"] += inputDat.value;
			} else if (inputDat.name === "Salida RILES tratados") {
				valores["salidaRiles"] += inputDat.value;
			} else if (inputDat.name === "Salida residuos municipales") {
				valores["salidaResiduosMunicipales"] += inputDat.value * 0.6;
			} else if (inputDat.name === "Salida Cartón/Papel") {
				valores["salidaCartonPapel"] += inputDat.value;
			} else if (inputDat.name === "Salida Plástico") {
				valores["salidaPlastico"] += inputDat.value;
			} else if (inputDat.name === "Salida chatarra ferrosa") {
				valores["salidaChatarraFerrosa"] += inputDat.value;
			} else if (inputDat.name === "Salida aluminio") {
				valores["salidaAluminio"] += inputDat.value;
			} else if (inputDat.name === "Salida tetrapack") {
				valores["salidaTetrapack"] += inputDat.value;
			} else if (inputDat.name === "Salida Incineración de biomasa") {
				valores["salidaIncineracionBiomasa"] += inputDat.value;
			} else if (inputDat.name === "Salida coproceso") {
				valores["salidaCoproceso"] += inputDat.value;
			} else if (inputDat.name === "Salida reutilización") {
				valores["salidaReutilizacion"] += inputDat.value;
			} else if (inputDat.name === "Salida peligrosos") {
				valores["salidaPeligrosos"] += inputDat.value;
			} else if (inputDat.name === "Salida inertes") {
				valores["salidaInerte"] += inputDat.value;
			}
		});
		const numerador =
			valores["generacionLodos"] +
			valores["salidaCompostaje"] +
			valores["salidaMasas"] +
			valores["salidaBiodigestion"] +
			valores["salidaRiles"] +
			valores["salidaCartonPapel"] +
			valores["salidaPlastico"] +
			valores["salidaChatarraFerrosa"] +
			valores["salidaAluminio"] +
			valores["salidaTetrapack"] +
			valores["salidaReutilizacion"];
		const denominador =
			valores["generacionLodos"] +
			valores["salidaCompostaje"] +
			valores["salidaMasas"] +
			valores["salidaBiodigestion"] +
			valores["salidaRiles"] +
			valores["salidaResiduosMunicipales"] +
			valores["salidaCartonPapel"] +
			valores["salidaPlastico"] +
			valores["salidaChatarraFerrosa"] +
			valores["salidaAluminio"] +
			valores["salidaTetrapack"] +
			valores["salidaIncineracionBiomasa"] +
			valores["salidaCoproceso"] +
			valores["salidaReutilizacion"] +
			valores["salidaPeligrosos"] +
			valores["salidaInerte"];
		const result = numerador / denominador;
		return { result: result, details };
	} else if (name === "Porcentaje desviación de relleno") {
		const valores = {
			generacionLodos: 0,
			salidaCompostaje: 0,
			salidaMasas: 0,
			salidaBiodigestion: 0,
			salidaRiles: 0,
			salidaResiduosMunicipales: 0,
			salidaCartonPapel: 0,
			salidaPlastico: 0,
			salidaChatarraFerrosa: 0,
			salidaAluminio: 0,
			salidaTetrapack: 0,
			salidaIncineracionBiomasa: 0,
			salidaCoproceso: 0,
			salidaReutilizacion: 0,
			salidaPeligrosos: 0,
			salidaInerte: 0,
		};
		inputDatsValues.forEach((inputDat) => {
			details[inputDat.name] = {
				valor: inputDat.value,
				unidad: inputDat.measurement,
			};
			if (inputDat.name === "Salida compostaje de lodo generado") {
				valores["generacionLodos"] += inputDat.value;
			} else if (inputDat.name === "Salida compostaje") {
				valores["salidaCompostaje"] += inputDat.value;
			} else if (inputDat.name === "Salida masas") {
				valores["salidaMasas"] += inputDat.value;
			} else if (inputDat.name === "Salida biodigestión") {
				valores["salidaBiodigestion"] += inputDat.value;
			} else if (inputDat.name === "Salida RILES tratados") {
				valores["salidaRiles"] += inputDat.value;
			} else if (inputDat.name === "Salida residuos municipales") {
				valores["salidaResiduosMunicipales"] += inputDat.value * 0.6;
			} else if (inputDat.name === "Salida Cartón/Papel") {
				valores["salidaCartonPapel"] += inputDat.value;
			} else if (inputDat.name === "Salida Plástico") {
				valores["salidaPlastico"] += inputDat.value;
			} else if (inputDat.name === "Salida chatarra ferrosa") {
				valores["salidaChatarraFerrosa"] += inputDat.value;
			} else if (inputDat.name === "Salida aluminio") {
				valores["salidaAluminio"] += inputDat.value;
			} else if (inputDat.name === "Salida tetrapack") {
				valores["salidaTetrapack"] += inputDat.value;
			} else if (inputDat.name === "Salida Incineración de biomasa") {
				valores["salidaIncineracionBiomasa"] += inputDat.value;
			} else if (inputDat.name === "Salida coproceso") {
				valores["salidaCoproceso"] += inputDat.value;
			} else if (inputDat.name === "Salida reutilización") {
				valores["salidaReutilizacion"] += inputDat.value;
			} else if (inputDat.name === "Salida peligrosos") {
				valores["salidaPeligrosos"] += inputDat.value;
			} else if (inputDat.name === "Salida inertes") {
				valores["salidaInerte"] += inputDat.value;
			}
		});
		const numerador =
			valores["generacionLodos"] +
			valores["salidaCompostaje"] +
			valores["salidaMasas"] +
			valores["salidaBiodigestion"] +
			valores["salidaRiles"] +
			valores["salidaCartonPapel"] +
			valores["salidaPlastico"] +
			valores["salidaChatarraFerrosa"] +
			valores["salidaAluminio"] +
			valores["salidaTetrapack"] +
			valores["salidaIncineracionBiomasa"] +
			valores["salidaCoproceso"] +
			valores["salidaReutilizacion"];
		const denominador =
			valores["generacionLodos"] +
			valores["salidaCompostaje"] +
			valores["salidaMasas"] +
			valores["salidaBiodigestion"] +
			valores["salidaRiles"] +
			valores["salidaResiduosMunicipales"] +
			valores["salidaCartonPapel"] +
			valores["salidaPlastico"] +
			valores["salidaChatarraFerrosa"] +
			valores["salidaAluminio"] +
			valores["salidaTetrapack"] +
			valores["salidaIncineracionBiomasa"] +
			valores["salidaCoproceso"] +
			valores["salidaReutilizacion"] +
			valores["salidaPeligrosos"] +
			valores["salidaInerte"];
		const result = numerador / denominador;
		return { result: result, details };
	} else if (name === "Intensidad de agua") {
		const valores = {
			entradaAguaTotal: 0,
			empleadosTotales: 0,
		};

		inputDatsValues.forEach((inputDat) => {
			details[inputDat.name] = {
				valor: inputDat.value,
				unidad: inputDat.measurement,
			};
			if (inputDat.name === "Entrada agua total") {
				valores["entradaAguaTotal"] = inputDat.value;
			}
			if (inputDat.name === "Empleados totales") {
				valores["empleadosTotales"] = inputDat.value;
			}
		});

		return {
			result: valores["entradaAguaTotal"] / valores["empleadosTotales"],
			details,
		};
	} else if (name === "Porcentaje circularidad agua de entrada") {
		const valores = {
			entradaAguaTotal: 0,
			entradaCircularMar: 0,
			entradaCircularSuperficial: 0,
			entradaCircularRegenerada: 0,
		};

		inputDatsValues.forEach((inputDat) => {
			details[inputDat.name] = {
				valor: inputDat.value,
				unidad: inputDat.measurement,
			};
			if (inputDat.name === "Entrada agua total") {
				valores["entradaAguaTotal"] = inputDat.value;
			}
			if (inputDat.name === "Entada circular de agua de mar") {
				valores["entradaCircularMar"] = inputDat.value;
			}
			if (
				inputDat.name ===
				"Entrada circular agua superficial y pozos de agua subterránea"
			) {
				valores["entradaCircularSuperficial"] = inputDat.value;
			}
			if (inputDat.name === "Entrada circular  de agua regenerada") {
				valores["entradaCircularRegenerada"] = inputDat.value;
			}
		});

		const numerador =
			valores["entradaCircularMar"] +
			valores["entradaCircularSuperficial"] +
			valores["entradaCircularRegenerada"];
		const denominador = valores["entradaAguaTotal"];

		return { result: numerador / denominador, details };
	} else if (name === "Porcentaje circularidad agua de salida") {
		const valores = {
			salidaCircular: 0,
			salidaLinealConsumo: 0,
			salidaLinealEvaporacion: 0,
			salidaLinealResiduoAgua: 0,
			salidaLinealExportacion: 0,
		};

		inputDatsValues.forEach((inputDat) => {
			details[inputDat.name] = {
				valor: inputDat.value,
				unidad: inputDat.measurement,
			};
			if (inputDat.name === "Salida de agua circular") {
				valores["salidaCircular"] = inputDat.value;
			}
			if (inputDat.name === "Salida de agua lineal por consumo") {
				valores["salidaLinealConsumo"] = inputDat.value;
			}
			if (inputDat.name === "Salida agua lineal por evaporación") {
				valores["salidaLinealEvaporacion"] = inputDat.value;
			}
			if (inputDat.name === "Salida agua lineal por residuo de agua") {
				valores["salidaLinealResiduoAgua"] = inputDat.value;
			}
			if (
				inputDat.name === "Salida agua lineal por exportación de agua"
			) {
				valores["salidaLinealExportacion"] = inputDat.value;
			}
		});

		const numerador = valores["salidaCircular"];
		const denominador =
			valores["salidaCircular"] +
			valores["salidaLinealConsumo"] +
			valores["salidaLinealEvaporacion"] +
			valores["salidaLinealResiduoAgua"] +
			valores["salidaLinealExportacion"];

		return { result: numerador / denominador, details };
	} else if (name === "Porcentaje de energía renovable") {
		const valores = {
			entradaCombustibleCarbon: 0,
			entradaCombustibleDiesel: 0,
			entradaCombustiblePetroleo: 0,
			entradaCombustibleGas: 0,
			entradaCombustibleGasLicuado: 0,
			entradaCombustibleGasolina: 0,
			entradaElectricidad: 0,
			entradaOtrosCombustibles: 0,
			entradaCombustibleFuenteRenovable: 0,
			entradaElectricidadFuenteRenovable: 0,
			entradaEnergiaAutogeneradaRenovable: 0,
		};
		inputDatsValues.forEach((inputDat) => {
			details[inputDat.name] = {
				valor: inputDat.value,
				unidad: inputDat.measurement,
			};
			if (inputDat.name === "Entrada combustible carbón") {
				valores["entradaCombustibleCarbon"] = inputDat.value;
			} else if (
				inputDat.name === "Entrada combustible petroleo 2 (Diesel)"
			) {
				valores["entradaCombustibleDiesel"] = inputDat.value;
			} else if (inputDat.name === "Entrada combustible petroleo 6") {
				valores["entradaCombustiblePetroleo"] = inputDat.value;
			} else if (inputDat.name === "Entrada combustible gas natural") {
				valores["entradaCombustibleGas"] = inputDat.value;
			} else if (
				inputDat.name ===
				"Entrada combustible gas licuado petroleo (GLP)"
			) {
				valores["entradaCombustibleGasLicuado"] = inputDat.value;
			} else if (inputDat.name === "Entrada combustible Gasolina") {
				valores["entradaCombustibleGasolina"] = inputDat.value;
			} else if (
				inputDat.name ===
				"Entrada electricidad, calor, vapor, refrigeración"
			) {
				valores["entradaElectricidad"] = inputDat.value;
			} else if (
				inputDat.name === "Entrada otros combustibles no renovables"
			) {
				valores["entradaOtrosCombustibles"] = inputDat.value;
			} else if (
				inputDat.name === "Entrada combustible fuente renovables"
			) {
				valores["entradaCombustibleFuenteRenovable"] = inputDat.value;
			} else if (
				inputDat.name === "Entrada electricidad fuente renovable"
			) {
				valores["entradaElectricidadFuenteRenovable"] = inputDat.value;
			} else if (
				inputDat.name === "Entrada energía autogenerada renovable"
			) {
				valores["entradaEnergiaAutogeneradaRenovable"] = inputDat.value;
			}
		});

		const numerador =
			valores["entradaCombustibleFuenteRenovable"] +
			valores["entradaElectricidadFuenteRenovable"] +
			valores["entradaEnergiaAutogeneradaRenovable"];

		const denominador =
			valores["entradaCombustibleCarbon"] +
			valores["entradaCombustibleDiesel"] +
			valores["entradaCombustiblePetroleo"] +
			valores["entradaCombustibleGas"] +
			valores["entradaCombustibleGasLicuado"] +
			valores["entradaCombustibleGasolina"] +
			valores["entradaElectricidad"] +
			valores["entradaOtrosCombustibles"];
		valores["entradaCombustibleFuenteRenovable"] +
			valores["entradaElectricidadFuenteRenovable"] +
			valores["entradaEnergiaAutogeneradaRenovable"];

		// Calculate division
		const result = numerador / denominador;

		return { result, details };
	} else if (name === "Consumo de energía") {
		const valores = {
			entradaCombustibleCarbon: 0,
			entradaCombustibleDiesel: 0,
			entradaCombustiblePetroleo: 0,
			entradaCombustibleGas: 0,
			entradaCombustibleGasLicuado: 0,
			entradaCombustibleGasolina: 0,
			entradaElectricidad: 0,
			entradaOtrosCombustibles: 0,
			entradaCombustibleFuenteRenovable: 0,
			entradaElectricidadFuenteRenovable: 0,
			entradaEnergiaAutogeneradaRenovable: 0,
		};
		inputDatsValues.forEach((inputDat) => {
			details[inputDat.name] = {
				valor: inputDat.value,
				unidad: inputDat.measurement,
			};
			if (inputDat.name === "Entrada combustible carbón") {
				valores["entradaCombustibleCarbon"] = inputDat.value;
			} else if (
				inputDat.name === "Entrada combustible petroleo 2 (Diesel)"
			) {
				valores["entradaCombustibleDiesel"] = inputDat.value;
			} else if (inputDat.name === "Entrada combustible petroleo 6") {
				valores["entradaCombustiblePetroleo"] = inputDat.value;
			} else if (inputDat.name === "Entrada combustible gas natural") {
				valores["entradaCombustibleGas"] = inputDat.value;
			} else if (
				inputDat.name ===
				"Entrada combustible gas licuado petroleo (GLP)"
			) {
				valores["entradaCombustibleGasLicuado"] = inputDat.value;
			} else if (inputDat.name === "Entrada combustible Gasolina") {
				valores["entradaCombustibleGasolina"] = inputDat.value;
			} else if (
				inputDat.name ===
				"Entrada electricidad, calor, vapor, refrigeración"
			) {
				valores["entradaElectricidad"] = inputDat.value;
			} else if (
				inputDat.name === "Entrada otros combustibles no renovables"
			) {
				valores["entradaOtrosCombustibles"] = inputDat.value;
			} else if (
				inputDat.name === "Entrada combustible fuente renovables"
			) {
				valores["entradaCombustibleFuenteRenovable"] = inputDat.value;
			} else if (
				inputDat.name === "Entrada electricidad fuente renovable"
			) {
				valores["entradaElectricidadFuenteRenovable"] = inputDat.value;
			} else if (
				inputDat.name === "Entrada energía autogenerada renovable"
			) {
				valores["entradaEnergiaAutogeneradaRenovable"] = inputDat.value;
			}
		});

		const value =
			valores["entradaCombustibleCarbon"] +
			valores["entradaCombustibleDiesel"] +
			valores["entradaCombustiblePetroleo"] +
			valores["entradaCombustibleGas"] +
			valores["entradaCombustibleGasLicuado"] +
			valores["entradaCombustibleGasolina"] +
			valores["entradaElectricidad"] +
			valores["entradaOtrosCombustibles"] +
			valores["entradaCombustibleFuenteRenovable"] +
			valores["entradaElectricidadFuenteRenovable"] +
			valores["entradaEnergiaAutogeneradaRenovable"];

		return { result: value, details };
	} else if (name === "Tasa de intensidad de energía") {
		const valores = {
			entradaCombustibleCarbon: 0,
			entradaCombustibleDiesel: 0,
			entradaCombustiblePetroleo: 0,
			entradaCombustibleGas: 0,
			entradaCombustibleGasLicuado: 0,
			entradaCombustibleGasolina: 0,
			entradaElectricidad: 0,
			entradaOtrosCombustibles: 0,
			entradaCombustibleFuenteRenovable: 0,
			entradaElectricidadFuenteRenovable: 0,
			entradaEnergiaAutogeneradaRenovable: 0,
			costosProveedoresLocales: 0,
		};

		inputDatsValues.forEach((inputDat) => {
			details[inputDat.name] = {
				valor: inputDat.value,
				unidad: inputDat.measurement,
			};
			if (inputDat.name === "Entrada combustible carbón") {
				valores["entradaCombustibleCarbon"] = inputDat.value;
			} else if (
				inputDat.name === "Entrada combustible petroleo 2 (Diesel)"
			) {
				valores["entradaCombustibleDiesel"] = inputDat.value;
			} else if (inputDat.name === "Entrada combustible petroleo 6") {
				valores["entradaCombustiblePetroleo"] = inputDat.value;
			} else if (inputDat.name === "Entrada combustible gas natural") {
				valores["entradaCombustibleGas"] = inputDat.value;
			} else if (
				inputDat.name ===
				"Entrada combustible gas licuado petroleo (GLP)"
			) {
				valores["entradaCombustibleGasLicuado"] = inputDat.value;
			} else if (inputDat.name === "Entrada combustible Gasolina") {
				valores["entradaCombustibleGasolina"] = inputDat.value;
			} else if (
				inputDat.name ===
				"Entrada electricidad, calor, vapor, refrigeración"
			) {
				valores["entradaElectricidad"] = inputDat.value;
			} else if (
				inputDat.name === "Entrada otros combustibles no renovables"
			) {
				valores["entradaOtrosCombustibles"] = inputDat.value;
			} else if (
				inputDat.name === "Entrada combustible fuente renovables"
			) {
				valores["entradaCombustibleFuenteRenovable"] = inputDat.value;
			} else if (
				inputDat.name === "Entrada electricidad fuente renovable"
			) {
				valores["entradaElectricidadFuenteRenovable"] = inputDat.value;
			} else if (
				inputDat.name === "Entrada energía autogenerada renovable"
			) {
				valores["entradaEnergiaAutogeneradaRenovable"] = inputDat.value;
			} else if (
				inputDat.name === "Costos gastados en proveedores locales"
			) {
				valores["costosProveedoresLocales"] = inputDat.value;
			}
		});

		const numerador =
			valores["entradaCombustibleCarbon"] +
			valores["entradaCombustibleDiesel"] +
			valores["entradaCombustiblePetroleo"] +
			valores["entradaCombustibleGas"] +
			valores["entradaCombustibleGasLicuado"] +
			valores["entradaCombustibleGasolina"] +
			valores["entradaElectricidad"] +
			valores["entradaOtrosCombustibles"] +
			valores["entradaCombustibleFuenteRenovable"] +
			valores["entradaElectricidadFuenteRenovable"] +
			valores["entradaEnergiaAutogeneradaRenovable"];

		const denominador = valores["costosProveedoresLocales"];
		return { result: numerador / denominador, details };
	} else if (name === "Porcentaje de circularidad entrada") {
		const valores = {
			entradaBiologicosRenovables: 0,
			entradaTecnicosNoVirgen: 0,
			entradaTotal: 0,
		};

		inputDatsValues.forEach((inputDat) => {
			details[inputDat.name] = {
				valor: inputDat.value,
				unidad: inputDat.measurement,
			};
			if (
				inputDat.name === "Entrada de suministros biológicos renovables"
			) {
				valores["entradaBiologicosRenovables"] = inputDat.value;
			}
			if (
				inputDat.name ===
				"Entrada de suministros técnicos de material no virgen"
			) {
				valores["entradaTecnicosNoVirgen"] = inputDat.value;
			}
			if (inputDat.name === "Entrada de suministros totales") {
				valores["entradaTotal"] = inputDat.value;
			}
		});

		const result =
			(valores["entradaBiologicosRenovables"] +
				valores["entradaTecnicosNoVirgen"]) /
			valores["entradaTotal"];

		return { result, details };
	} else if (name === "Proporción de gasto en proveedores locales") {
		const valores = {
			costosProveedoresLocales: 0,
			costosTotalesProveedores: 0,
		};

		inputDatsValues.forEach((inputDat) => {
			details[inputDat.name] = {
				valor: inputDat.value,
				unidad: inputDat.measurement,
			};
			if (inputDat.name === "Costos gastados en proveedores locales") {
				valores["costosProveedoresLocales"] = inputDat.value;
			}
			if (inputDat.name === "Costos totales gastados en proveedores") {
				valores["costosTotalesProveedores"] = inputDat.value;
			}
		});

		const result =
			valores["costosProveedoresLocales"] /
			valores["costosTotalesProveedores"];

		return { result, details };
	} else if (name === "Productividad circular de material") {
		/* Aquí irán los indicadores económicos */
		const valores = {
			ingresosTotales: 0,
			salidaResiduosMunicipales: 0,
			salidaIncineracionBiomasa: 0,
			salidaCoproceso: 0,
			salidaPeligrosos: 0,
			salidaInertes: 0,
		};

		inputDatsValues.forEach((inputDat) => {
			details[inputDat.name] = {
				valor: inputDat.value,
				unidad: inputDat.measurement,
			};
			if (inputDat.name === "Ingresos totales") {
				valores["ingresosTotales"] = inputDat.value;
			}
			if (inputDat.name === "Salida residuos municipales") {
				valores["salidaResiduosMunicipales"] = inputDat.value;
			}
			if (inputDat.name === "Salida Incineración de biomasa") {
				valores["salidaIncineracionBiomasa"] = inputDat.value;
			}
			if (inputDat.name === "Salida coproceso") {
				valores["salidaCoproceso"] = inputDat.value;
			}
			if (inputDat.name === "Salida peligrosos") {
				valores["salidaPeligrosos"] = inputDat.value;
			}
			if (inputDat.name === "Salida inertes") {
				valores["salidaInertes"] = inputDat.value;
			}
		});

		const numerador = valores["ingresosTotales"];
		const denominador =
			valores["salidaResiduosMunicipales"] +
			valores["salidaIncineracionBiomasa"] +
			valores["salidaCoproceso"] +
			valores["salidaPeligrosos"] +
			valores["salidaInertes"];

		const result = numerador / denominador;

		return { result, details };
	} else if (name === "Porcentaje de ingreso por acciones circulares") {
		const valores = {
			ingresoVentaSubproducto: 0,
			ingresoServicioCircularReciclaje: 0,
			ingresosTotales: 0,
		};

		inputDatsValues.forEach((inputDat) => {
			details[inputDat.name] = {
				valor: inputDat.value,
				unidad: inputDat.measurement,
			};
			if (inputDat.name === "Ingreso por venta de subproducto") {
				valores["ingresoVentaSubproducto"] = inputDat.value;
			}
			if (
				inputDat.name === "Ingreso por servicio circular de reciclaje"
			) {
				valores["ingresoServicioCircularReciclaje"] = inputDat.value;
			}
			if (inputDat.name === "Ingresos totales") {
				valores["ingresosTotales"] = inputDat.value;
			}
		});

		const result =
			(valores["ingresoVentaSubproducto"] +
				valores["ingresoServicioCircularReciclaje"]) /
			valores["ingresosTotales"];

		return { result, details };
	} else if (name === "Porcentaje inversión en circularidad") {
		const valores = {
			inversionCircularPersonal: 0,
			inversionCircularProyectos: 0,
			inversionTotal: 0,
		};

		inputDatsValues.forEach((inputDat) => {
			details[inputDat.name] = {
				valor: inputDat.value,
				unidad: inputDat.measurement,
			};
			if (inputDat.name === "Inversión circular de personal") {
				valores["inversionCircularPersonal"] = inputDat.value;
			}
			if (inputDat.name === "Inversión circular de proyectos") {
				valores["inversionCircularProyectos"] = inputDat.value;
			}
			if (inputDat.name === "Inversión total") {
				valores["inversionTotal"] = inputDat.value;
			}
		});

		const result =
			(valores["inversionCircularPersonal"] +
				valores["inversionCircularProyectos"]) /
			valores["inversionTotal"];

		return { result, details };
	} else if (name === "Empleo verde") {
		const valores = {
			empleosDirectos: 0,
			empleosIndirectosCreados: 0,
		};

		inputDatsValues.forEach((inputDat) => {
			details[inputDat.name] = {
				valor: inputDat.value,
				unidad: inputDat.measurement,
			};
			if (inputDat.name === "Empleos directos") {
				valores["empleosDirectos"] = inputDat.value;
			}
			if (inputDat.name === "Empleos indirectos creados (contratistas)") {
				valores["empleosIndirectosCreados"] = inputDat.value;
			}
		});

		const result =
			valores["empleosDirectos"] + valores["empleosIndirectosCreados"];

		return { result, details };
	} else if (name === "Educación ambiental interna") {
		const valores = {
			horasCharlasEC: 0,
			numeroAsistentesCharla: 0,
		};

		inputDatsValues.forEach((inputDat) => {
			details[inputDat.name] = {
				valor: inputDat.value,
				unidad: inputDat.measurement,
			};
			if (inputDat.name === "Horas charlas de EC") {
				valores["horasCharlasEC"] = inputDat.value;
			}
			if (inputDat.name === "Número de asistentes a las charla") {
				valores["numeroAsistentesCharla"] = inputDat.value;
			}
		});

		const result =
			valores["horasCharlasEC"] / valores["numeroAsistentesCharla"];

		return { result, details };
	} else if (name === "Porcentaje de participación femenina") {
		const valores = {
			empleadosTotales: 0,
			empleosMujeres: 0,
		};

		inputDatsValues.forEach((inputDat) => {
			details[inputDat.name] = {
				valor: inputDat.value,
				unidad: inputDat.measurement,
			};
			if (inputDat.name === "Empleados totales") {
				valores["empleadosTotales"] = inputDat.value;
			}
			if (inputDat.name === "Empleos ocupados por mujeres") {
				valores["empleosMujeres"] = inputDat.value;
			}
		});

		const result = valores["empleosMujeres"] / valores["empleadosTotales"];

		return { result, details };
	} else if (name === "Social explicito") {
		inputDatsValues.forEach((inputDat) => {
			details[inputDat.name] = {
				valor: inputDat.value,
				unidad: inputDat.measurement,
			};
		});
		return { result: 0, details };
	}

	return undefined;
};

export { getValue };
