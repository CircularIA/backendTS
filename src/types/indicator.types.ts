export const IndicatorCategoriesList = [
	"Ambiental",
	"Social",
	"Economica",
] as const;

// Tipo de TS
export type IndicatorCategories = (typeof IndicatorCategoriesList)[number];

export const SourcesTypesList = [
	"Residuos",
	"Emisiones",
	"Energía",
	"Agua",
	"Cadena de suministros",
	"Ingreso",
	"Egreso",
	"Empleos",
	"Educación",
	"Interno",
	"Seguridad",
	"Sinergía",
] as const;

export type SourcesTypes = (typeof SourcesTypesList)[number];
export interface Norm {
	norm: string;
	type: string;
}

export interface Ecoquivalence {
	co2: number;
	agua: number;
	arboles: number;
	energia: number;
}

export type SubCategorie =
	| "Salida y valorización de Residuos, Productos y subproductos"
	| "Agua"
	| "Energía"
	| "Huella de carbono de salida"
	| "Entrada de suministros"
	| "Productividad circular de material"
	| "Porcentaje de ingreso por acciones circulares"
	| "Porcentaje inversión en circularidad"
	| "Empleo verde"
	| "Porcentaje de empleos circulares"
	| "Educación ambiental interna"
	| "Porcentaje de participación femenina"
	| "Social explícito"
	| "Número de accidentes en un periodo"
	| "Número de sinergia industrial";
