import { IEmissionSource } from "@src/models/EmissionSource";
import { Measurements } from "./common.types";

export type TypeEmission = "DIRECTA" | "INDIRECTA" | "OTRAS";

export type SourceEmissionDirect =
	| "Combustión estacionaria"
	| "Combustión móvil"
	| "Procesos industriales"
	| "Emisiones Fugitivas"
	| "Remociones";

export type SourceEmissionIndirect = "Electricidad" | "Otras";

export type SourceEmissionOther =
	| "Bienes servicios"
	| "Transporte terceros"
	| "Transporte cargas"
	| "Tratamiento disposición residuos";

export const typeByEmissionSource: Record<SourceEmissionDirect, string[]> = {
	"Combustión estacionaria": [
		"Generador",
		"Turbina",
		"Caldera",
		"Baños y camarines",
	],
	"Combustión móvil": ["Medio terrestre", "Medio marítimo", "Medio aéreo"],
	"Procesos industriales": ["Tratamiento de residuos y aguas res. Directas"],
	"Emisiones Fugitivas": ["Gases refrigerantes"],
	Remociones: ["FE propio"],
};

export const detailsByEmissionSource: Record<SourceEmissionDirect, string[]> = {
	"Combustión estacionaria": [
		"Carbón",
		"Gas ciudad (cañeria o corriente)",
		"Gas de alto horno",
		"Gas de refinería",
		"Gas licuado de petróleo",
		"Gas natural",
		"Gasolina",
		"Kerosene",
		"Nafta",
		"Petcoke",
		"Petróleo 2 (Diesel)",
		"Petróleo 5",
		"Petróleo 6",
		"Fe Propio (Biogas quemado en antorcha)",
	],
	"Combustión móvil": [
		"Gas licuado de petróleo",
		"Gas natural",
		"Gasolina",
		"Kerosene",
		"Petróleo 2 (Diesel)",
	],
	"Procesos industriales": [
		"Relleno sanitario",
		"Relleno seguridad",
		"Compostaje",
		"Monorelleno",
		"Planta tratamiento de riles",
	],
	"Emisiones Fugitivas": [
		"SF6 Hexafluoruro de azufre",
		"HFC-125",
		"HFC-134",
		"HFC-134a",
		"HFC-143",
		"HFC-143a",
		"HFC-152a",
		"HFC-227ea",
		"HFC-23",
		"HFC-236fa",
		"HFC-245fa",
		"HFC-32",
		"HFC-41",
		"HFC-43-l0mee",
		"CH4 Metano",
		"PFC-3-1-10 Perfluorobutano",
		"PFC-318 Perfluorociclobutano",
		"PFC-116 Perfluoroetano",
		"PFC-5-1-14 Perfluorohexano",
		"PFC-14 Perfluorometano",
		"PFC-4-1-12 Perfluoropentano",
		"PFC-218 Perfluoropropano",
		"R404A",
		"R407A",
		"R407B",
		"R407C",
		"R410A",
		"R410B",
		"R507",
		"R508A",
		"R508B",
		"Trifluoruro de nitrógeno (NF3)",
	],
	Remociones: [
		"Cambio de uso de suelo",
		"Cosecha",
		"Incremento de biomas arbórea",
	],
};

interface EmissionFactor
	extends Pick<
		IEmissionSource,
		"measurement" | "emission_factor" | "unit_factor" | "origin_factor"
	> {
	name: string;
}

export const emissionFactorByEmissionSource: Record<
	SourceEmissionDirect,
	EmissionFactor[]
> = {
	"Combustión estacionaria": [
		{
			name: "Carbón",
			measurement: "kg",
			emission_factor: 2698.5459,
			unit_factor: "kgCO2eq",
			origin_factor:
				"IPCC 2006 Guidelines for National Greenhouse Gas Inventories en base al Balance Nacional de Energía",
		},
		{
			name: "Gas ciudad (cañeria o corriente)",
			measurement: "kg",
			emission_factor: 1.73,
			unit_factor: "kgCO2eq",
			origin_factor: "Huella chile",
		},
		{
			name: "Gas de alto horno",
			measurement: "kg",
			emission_factor: 0.79,
			unit_factor: "kgCO2eq",
			origin_factor: "Huella chile",
		},
		{
			name: "Gas de refinería",
			measurement: "m3",
			emission_factor: 0.9254,
			unit_factor: "kgCO2eq",
			origin_factor: "Huella chile",
		},
		{
			name: "Gas licuado de petróleo",
			measurement: "m3",
			emission_factor: 1583.7152,
			unit_factor: "kgCO2eq",
			origin_factor:
				"IPCC 2006 Guidelines for National Greenhouse Gas Inventories en base al Balance Nacional de Energía",
		},
		{
			name: "Gas natural",
			measurement: "m3",
			emission_factor: 1.9765,
			unit_factor: "kgCO2eq",
			origin_factor: "Huella chile",
		},
		{
			name: "Gasolina",
			measurement: "m3",
			emission_factor: 2261.5184,
			unit_factor: "kgCO2eq",
			origin_factor:
				"IPCC 2006 Guidelines for National Greenhouse Gas Inventories en base al Balance Nacional de Energía",
		},
		{
			name: "Kerosene",
			measurement: "m3",
			emission_factor: 2579.9307,
			unit_factor: "kgCO2eq",
			origin_factor: "Huella chile",
		},
		{
			name: "Nafta",
			measurement: "m3",
			emission_factor: 2354.7404,
			unit_factor: "kgCO2eq",
			origin_factor:
				"IPCC 2006 Guidelines for National Greenhouse Gas Inventories en base al Balance Nacional de Energía",
		},
		{
			name: "Petcoke",
			measurement: "kg",
			emission_factor: 2.85,
			unit_factor: "kgCO2eq",
			origin_factor: "Huella chile",
		},
		{
			name: "Petróleo 2 (Diesel)",
			measurement: "m3",
			emission_factor: 2707.3954,
			unit_factor: "kgCO2eq",
			origin_factor: "Huella chile",
		},
		{
			name: "Petróleo 5",
			measurement: "m3",
			emission_factor: 3005.9182,
			unit_factor: "kgCO2eq",
			origin_factor: "Huella chile",
		},
		{
			name: "Petróleo 6",
			measurement: "m3",
			emission_factor: 3064.9182,
			unit_factor: "kgCO2eq",
			origin_factor: "Huella chile",
		},
		{
			name: "FE propio(Biogas quemado en antorcha)",
			measurement: "kg",
			emission_factor: 0.00069343,
			unit_factor: "kgCO2eq",
			origin_factor:
				"DEFRA 2020 - UK government GHG Conversion Factors for Company Reporting, Bioenergy Scope 1 31-07-2020",
		},
	],
	"Combustión móvil": [
		{
			name: "Gas licuado de petróleo",
			measurement: "m3",
			emission_factor: 1583.7152,
			unit_factor: "kgCO2eq",
			origin_factor:
				"IPCC 2006 Guidelines for National Greenhouse Gas Inventories en base al Balance Nacional de EnergÃ­a",
		},
		{
			name: "Gas natural",
			measurement: "m3",
			emission_factor: 1.9765,
			unit_factor: "kgCO2eq",
			origin_factor: "Huella chile",
		},
		{
			name: "Gasolina",
			measurement: "m3",
			emission_factor: 2261.5184,
			unit_factor: "kgCO2eq",
			origin_factor:
				"IPCC 2006 Guidelines for National Greenhouse Gas Inventories en base al Balance Nacional de EnergÃ­a",
		},
		{
			name: "Kerosene",
			measurement: "m3",
			emission_factor: 2579.9307,
			unit_factor: "kgCO2eq",
			origin_factor: "Huella chile",
		},
		{
			name: "Petróleo 2 (Diesel)",
			measurement: "m3",
			emission_factor: 2707.3954,
			unit_factor: "kgCO2eq",
			origin_factor: "Huella chile",
		},
	],
	"Procesos industriales": [
		{
			name: "Relleno sanitario",
			measurement: "ton",
			emission_factor: 447.7,
			unit_factor: "kgCO2eq",
			origin_factor:
				"Waste disposal - Greenhouse gas reporting: conversion factors 2020 https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2020",
		},
		{
			name: "Compostaje",
			measurement: "ton",
			emission_factor: 10.2,
			unit_factor: "kgCO2eq",
			origin_factor:
				"Waste disposal - Greenhouse gas reporting: conversion factors 2020 https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2020",
		},
		{
			name: "Monorelleno",
			measurement: "ton",
			emission_factor: 447.7,
			unit_factor: "kgCO2eq",
			origin_factor:
				"Waste disposal - Greenhouse gas reporting: conversion factors 2020 https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2020",
		},
	],
	"Emisiones fugitivas": [
		{
			name: "SF6 Hexafluoruro de azufre",
			measurement: "kg",
			emission_factor: 23500,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "HFC-125",
			measurement: "kg",
			emission_factor: 3170,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "HFC-134",
			measurement: "kg",
			emission_factor: 1120,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "HFC-134a",
			measurement: "kg",
			emission_factor: 1300,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "HFC-143",
			measurement: "kg",
			emission_factor: 328,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "HFC-143a",
			measurement: "kg",
			emission_factor: 4800,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "HFC-152a",
			measurement: "kg",
			emission_factor: 138,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "HFC-227ea",
			measurement: "kg",
			emission_factor: 3350,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "HFC-23",
			measurement: "kg",
			emission_factor: 12400,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "HFC-236fa",
			measurement: "kg",
			emission_factor: 8060,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "HFC-245fa",
			measurement: "kg",
			emission_factor: 858,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "HFC-32",
			measurement: "kg",
			emission_factor: 677,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "HFC-41",
			measurement: "kg",
			emission_factor: 116,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "HFC-43-l0mee",
			measurement: "kg",
			emission_factor: 1650,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "CH4 Metano",
			measurement: "kg",
			emission_factor: 28,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "PFC-3-1-10 Perfluorobutano",
			measurement: "kg",
			emission_factor: 9200,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "PFC-318 Perfluorociclobutano",
			measurement: "kg",
			emission_factor: 9540,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "PFC-116 Perfluoroetano",
			measurement: "kg",
			emission_factor: 11100,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "PFC-5-1-14 Perfluorohexano",
			measurement: "kg",
			emission_factor: 7910,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "PFC-14 Perfluorometano",
			measurement: "kg",
			emission_factor: 6630,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "PFC-4-1-12 Perfluoropentano",
			measurement: "kg",
			emission_factor: 8550,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "PFC-218 Perfluoropropano",
			measurement: "kg",
			emission_factor: 8900,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "R404A",
			measurement: "kg",
			emission_factor: 3942.8,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "R407A",
			measurement: "kg",
			emission_factor: 1923.4,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "R407B",
			measurement: "kg",
			emission_factor: 2546.7,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "R407C",
			measurement: "kg",
			emission_factor: 1624.21,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "R410A",
			measurement: "kg",
			emission_factor: 1923.5,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "R410B",
			measurement: "kg",
			emission_factor: 2048.15,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "R507",
			measurement: "kg",
			emission_factor: 3985,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "R508A",
			measurement: "kg",
			emission_factor: 11607,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "R508B",
			measurement: "kg",
			emission_factor: 11698,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
		{
			name: "Trifluoruro de nitrógeno (NF3)",
			measurement: "kg",
			emission_factor: 16100,
			unit_factor: "kgCO2eq",
			origin_factor: "Fuente: Datos proporcionados por el usuario",
		},
	],
	Remociones: [],
};

export const typeByEmissionSourceIndirect: Record<
	SourceEmissionIndirect,
	string[]
> = {
	Electricidad: ["Consumo eléctrico"],
	Otras: ["Aire Comprimido", "Calefacción", "Refrigeración", "Vapor"],
};
export const detailsByEmissionSourceIndirect: Record<
	SourceEmissionIndirect,
	string[]
> = {
	Electricidad: [
		"SING Sistema Interconectadodel Los Lagos",
		"SIC Sistema interconectado central",
		"Sistema electrico de magallanes",
		"Sistema eléctrico de Aysen",
	],
	Otras: [
		"Gas licuado petroleo",
		"Gas natural",
		"Gasolina",
		"Petroleo 2 (Diesel)",
		"Petroleo 6",
	],
};

export const typeByEmissionSourceOther: Record<SourceEmissionOther, string[]> =
	{
		"Bienes servicios": ["Bienes adquiridos", "Servicios adquiridos"],
		"Transporte terceros": [
			"Transporte clientes y visitantes",
			"Traslado diario de personal",
			"Viaje de negocios",
		],
		"Transporte cargas": [
			"Insumos aéreos",
			"Insumos marítimos",
			"Insumos terrestres",
			"Productos aéreos",
			"Productos marítimos",
			"Productos terrestres",
			"Residuos-municipales (disposición)",
			"Residuos-otros",
			"Residuos-reciclaje",
		],
		"Tratamiento disposición residuos": [
			"Compostaje",
			"Relleno sanitario",
			"Vertedero",
			"Reciclaje",
			"Relleno de seguridad",
			"Planta de tratamiento de riles",
		],
	};

export const detailsByEmissionSourceOther: Record<
	SourceEmissionOther,
	string[]
> = {
	"Bienes servicios": [
		"Acero general",
		"Acero reciclado",
		"Aluminio",
		"Fertilizante: fosfatados",
		"Fertilizante: Nitrato amonio",
		"Fertilizante: Nitrogenados convencional",
		"Fertilizante: NPK general",
		"Fertilizante: Urea",
		"Gas licuado de petróleo",
		"Petcoke",
		"Gas natural",
		"Gasolina",
		"Hormigon",
		"Impresión y publicación",
		"Leña",
		"Lubricantes",
		"Madera y productos de madera (viruta)",
		"Metal: Latas de aluminio y otros metales",
		"Neumáticos",
		"Papel",
		"Petroleo 2 (Diesel)",
		"Plasticos promedio",
		"Plasticos film",
		"Policloruro de vinilo (PVC)",
		"Poliestireno (PS)",
		"Polietileno de alta densidad (HDPE)",
		"Polietileno de baja densidad (LLDPE)",
		"Polipropileno (PP)",
		"Tereftalato de polietileno (PET)",
		"Textiles",
		"Tintas impresión",
		"Vidrio",
		"Yeso cartón",
		"Servicio de actividades legales, negocios, consultorias",
		"Servicio de agua potable: suministro y tratamiento",
		"Otro: Viruta",
	],
	"Transporte terceros": [
		"Aereo - Avión trayecto doméstico",
		"Aereo - Avión trayecto internacional",
		"Terrestre - Bus interurbano (45 pers)",
		"Terrestre - Bus local (25 pers)",
		"Terrestre - Bus transantiago",
		"Terrestre - Metro",
		"Terrestre - Motocicleta",
		"Terrestre - Taxi",
		"Terrestre - Tren",
		"Terrestre - Van",
		"Terrestre - Vehiculo particular - diesel",
		"Terrestre - Vehiculo particular - gasolina",
		"Transporte clientes y visitantes",
		"Traslado diario de personal",
		"Viaje de negocios",
	],
	"Transporte cargas": [
		"Avión trayecto domestico",
		"Avión trayecto internacional",
		"Barco granel",
		"Barco contenedor",
		"Camión articulado promedio 11t",
		"Camión articulado promedio 7t",
		"Camión rigido promedio carga 3t",
		"Tren",
		"Vehiculos medianos (Van) - Diesel",
		"Maquinaria excavaciones (Trabajo en RSU y compostaje)",
		"Transporte residuos peligrosos (Transmaule)",
		"Insumos aéreos",
		"Insumos marítimos",
		"Insumos terrestres",
		"Productos aéreos",
		"Productos marítimos",
		"Productos terrestres",
		"Residuos-municipales (disposición)",
		"Residuos-otros",
		"Residuos-reciclaje",
	],
	"Tratamiento disposición residuos": [
		"Compostaje Residuos organicos",
		"Vertedero residuos comerciales e industriales",
		"Vertedero residuos municipales",
		"Reclj. - Aceite mineral",
		"Reclj. - Escombros",
		"Reclj. - Baterías (post consumo)",
		"Reclj. - Construcción, demolición y excavación",
		"Reclj. - Equipos electricos y electronicos",
		"Reclj. - Madera",
		"Reclj. - Metal: Chatarra metálica",
		"Reclj. - Metal: aluminio",
		"Reclj. - Neumáticos",
		"Reclj. - Papel y cartón",
		"Reclj. - plásticos promedio",
		"Reclj. - Plásticos: HDPE",
		"Reclj. - Plásticos: LDPE y LLDPE",
		"Reclj. - Plasticos: PET",
		"Reclj. - Plásticos: PP",
		"Reclj. - Plásticos: PS",
		"Reclj. - Plásticos: PVC",
		"Reclj. - Textiles",
		"Reclj. - Vidrio",
		"Residuos peligrosos",
		"Residuos industriales liquidos",
		"Compostaje",
		"Relleno sanitario",
		"Vertedero",
		"Reciclaje",
		"Relleno de seguridad",
		"Planta de tratamiento de riles",
	],
};
