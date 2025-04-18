const monthNames = [
	"enero",
	"febrero",
	"marzo",
	"abril",
	"mayo",
	"junio",
	"julio",
	"agosto",
	"septiembre",
	"octubre",
	"noviembre",
	"diciembre",
];

export const getMonthName = (monthNumber: number) => {
	return monthNames[monthNumber];
};
