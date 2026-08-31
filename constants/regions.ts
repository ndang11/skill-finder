// Cameroon regions and cities
export interface City {
	id: string;
	name: string;
}

export interface Region {
	id: string;
	name: string;
	cities: City[];
}

export const CAMEROON_REGIONS: Region[] = [
	{
		id: "LT",
		name: "Littoral",
		cities: [
			{ id: "douala", name: "Douala" },
			{ id: "edea", name: "Edéa" },
			{ id: "nkongsamba", name: "Nkongsamba" },
		],
	},
	{
		id: "CE",
		name: "Centre",
		cities: [
			{ id: "yaounde", name: "Yaoundé" },
			{ id: "mbalmayo", name: "Mbalmayo" },
			{ id: "bafia", name: "Bafia" },
		],
	},
	{
		id: "NW",
		name: "North West",
		cities: [
			{ id: "bamenda", name: "Bamenda" },
			{ id: "kumbo", name: "Kumbo" },
			{ id: "wum", name: "Wum" },
		],
	},
	{
		id: "SW",
		name: "South West",
		cities: [
			{ id: "buea", name: "Buea" },
			{ id: "limbe", name: "Limbe" },
			{ id: "kumba", name: "Kumba" },
		],
	},
	{
		id: "OU",
		name: "West (Ouest)",
		cities: [
			{ id: "bafoussam", name: "Bafoussam" },
			{ id: "dschang", name: "Dschang" },
			{ id: "foumban", name: "Foumban" },
		],
	},
	{
		id: "AD",
		name: "Adamawa",
		cities: [
			{ id: "ngaoundere", name: "Ngaoundéré" },
			{ id: "tignere", name: "Tignère" },
		],
	},
	{
		id: "EN",
		name: "Far North (Extrême-Nord)",
		cities: [
			{ id: "maroua", name: "Maroua" },
			{ id: "kousseri", name: "Kousseri" },
		],
	},
	{
		id: "NO",
		name: "North (Nord)",
		cities: [
			{ id: "garoua", name: "Garoua" },
			{ id: "guider", name: "Guider" },
		],
	},
	{
		id: "EE",
		name: "East (Est)",
		cities: [
			{ id: "bertoua", name: "Bertoua" },
			{ id: "batouri", name: "Batouri" },
		],
	},
	{
		id: "SU",
		name: "South (Sud)",
		cities: [
			{ id: "ebolowa", name: "Ebolowa" },
			{ id: "kribi", name: "Kribi" },
			{ id: "sangmelima", name: "Sangmélima" },
		],
	},
];
