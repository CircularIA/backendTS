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

const typeByEmissionSource: Record<SourceEmissionDirect, string[]> = {
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

const detailsByEmissionSource: Record<SourceEmissionDirect, string[]> = {
	"Combustión estacionaria": ["Gas natural", "Carbón"],
	"Combustión móvil": ["Gas natural", "Carbón"],
	"Procesos industriales": ["Gas natural", "Carbón"],
	"Emisiones Fugitivas": ["Gas natural", "Carbón"],
	Remociones: ["Gas natural", "Carbón"],
};

const typeByEmissionSourceIndirect: Record<SourceEmissionIndirect, string[]> = {
	Electricidad: ["Consumo eléctrico"],
	Otras: ["Aire Comprimido", "Calefacción", "Refrigeración", "Vapor"],
};
const detailsByEmissionSourceIndirect: Record<
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

const typeByEmissionSourceOther: Record<SourceEmissionOther, string[]> = {
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

const detailsByEmissionSourceOther: Record<SourceEmissionOther, string[]> = {
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
		"",
	],
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
