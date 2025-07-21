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
