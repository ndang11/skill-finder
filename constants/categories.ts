// constants/categories.ts
import {
	BatteryCharging,
	Bike,
	Code,
	Construction,
	Cpu,
	CreditCard,
	Flame,
	Footprints,
	Hammer,
	MoreHorizontal,
	Palette,
	Printer,
	Scissors,
	Settings,
	Shield,
	Shirt,
	ShoppingBag,
	Smartphone,
	Snowflake,
	Sparkles,
	Sun,
	Utensils,
	Wheat,
	Wrench,
	Zap,
} from "lucide-react";
import type React from "react";

export interface CameroonianSkillItem {
	id: string;
	name: string;
	nameFr: string;
	sector: string;
	sectorFr: string;
	source:
		| "MINEFOP"
		| "INS / FNE"
		| "Artisanal Chamber (CMA)"
		| "Bayam-Sellam & Street Tech";
	descriptionEn: string;
	descriptionFr: string;
	icon: React.ComponentType<{ className?: string }>;
}

export const CAMEROON_SKILLS: CameroonianSkillItem[] = [
	// Sector 1: Vocational & Building Trades (MINEFOP & Artisanal Chamber)
	{
		id: "electrician",
		name: "Electrician",
		nameFr: "Électricien",
		sector: "Vocational & Construction",
		sectorFr: "Bâtiment & Électricité",
		source: "MINEFOP",
		descriptionEn:
			"Residential & industrial wiring, fault troubleshooting, circuit installation.",
		descriptionFr:
			"Câblage résidentiel & industriel, dépannage, installation de disjoncteurs.",
		icon: Zap,
	},
	{
		id: "plumber",
		name: "Plumber",
		nameFr: "Plombier-Sanitaire",
		sector: "Vocational & Construction",
		sectorFr: "Bâtiment & Électricité",
		source: "MINEFOP",
		descriptionEn:
			"Pipe fitting, water pump installation, bathroom & drainage maintenance.",
		descriptionFr:
			"Tuyauterie, installation pompes à eau, entretien sanitaire & canalisations.",
		icon: Wrench,
	},
	{
		id: "mason",
		name: "Mason / Bricklayer",
		nameFr: "Maçon / Carreleur",
		sector: "Vocational & Construction",
		sectorFr: "Bâtiment & Électricité",
		source: "MINEFOP",
		descriptionEn:
			"Foundation work, bricklaying, tile fitting, concrete casting.",
		descriptionFr:
			"Fondation, maçonnerie générale, pose de carrelage, béton armé.",
		icon: Construction,
	},
	{
		id: "carpenter",
		name: "Carpenter & Woodworker",
		nameFr: "Menuisier - Ébéniste",
		sector: "Vocational & Construction",
		sectorFr: "Bâtiment & Électricité",
		source: "Artisanal Chamber (CMA)",
		descriptionEn:
			"Custom furniture, roof framework, door & window fabrication.",
		descriptionFr:
			"Fabrication meubles, charpente bois, portes & fenêtres sur-mesure.",
		icon: Hammer,
	},
	{
		id: "painter",
		name: "Painter & Decorator",
		nameFr: "Peintre en Bâtiment",
		sector: "Vocational & Construction",
		sectorFr: "Bâtiment & Électricité",
		source: "Artisanal Chamber (CMA)",
		descriptionEn:
			"Interior & exterior wall painting, waterproof coating, wall decoration.",
		descriptionFr:
			"Peinture d'intérieur/extérieur, étanchéité, revêtement décoratif.",
		icon: Palette,
	},
	{
		id: "welder",
		name: "Welder & Metal Fabricator",
		nameFr: "Soudeur - Ferronnier",
		sector: "Vocational & Construction",
		sectorFr: "Bâtiment & Électricité",
		source: "MINEFOP",
		descriptionEn:
			"Arc welding, metal gates, security grilles, structural steelwork.",
		descriptionFr:
			"Soudure à l'arc, portails métalliques, grilles de sécurité, charpente métallique.",
		icon: Flame,
	},

	// Sector 2: Automotive & Machinery Maintenance (MINEFOP & Street Mechanics)
	{
		id: "mechanic",
		name: "Auto Mechanic",
		nameFr: "Mécanicien Auto",
		sector: "Automotive & Machinery",
		sectorFr: "Automobile & Mécanique",
		source: "MINEFOP",
		descriptionEn:
			"Engine diagnostics, brake systems, overhaul, vehicle servicing.",
		descriptionFr:
			"Diagnostic moteur, système de freinage, vidange, entretien véhicules.",
		icon: Settings,
	},
	{
		id: "auto-electrician",
		name: "Auto Electrician",
		nameFr: "Électricien Auto",
		sector: "Automotive & Machinery",
		sectorFr: "Automobile & Mécanique",
		source: "MINEFOP",
		descriptionEn:
			"Vehicle wiring, alternator repair, battery diagnostics, ECU coding.",
		descriptionFr:
			"Câblage automobile, alternateurs, batteries, diagnostic électronique.",
		icon: BatteryCharging,
	},
	{
		id: "motorbike-mechanic",
		name: "Motorbike & Tricycle Mechanic",
		nameFr: "Mécanicien Moto / Keke",
		sector: "Automotive & Machinery",
		sectorFr: "Automobile & Mécanique",
		source: "Bayam-Sellam & Street Tech",
		descriptionEn:
			"Commercial moto-taxie & tricycle (Keke) engine repair & tuning.",
		descriptionFr:
			"Entretien & réparation moteurs de moto-taxie & tricyle (Keke).",
		icon: Bike,
	},
	{
		id: "generator-tech",
		name: "Generator & Pump Technician",
		nameFr: "Technicien Groupes & Pompes",
		sector: "Automotive & Machinery",
		sectorFr: "Automobile & Mécanique",
		source: "MINEFOP",
		descriptionEn:
			"Diesel & petrol generator repair, water pump installation & servicing.",
		descriptionFr:
			"Dépannage groupes électrogènes diesel/essence & motopompes.",
		icon: Cpu,
	},

	// Sector 3: Street-Level Tech & Digital Services (Bayam-Sellam / Tech / INS)
	{
		id: "phone-repair",
		name: "Phone & Laptop Hardware Repair",
		nameFr: "Réparation Téléphones & PC",
		sector: "Tech & Digital Services",
		sectorFr: "Tech & Services Numériques",
		source: "Bayam-Sellam & Street Tech",
		descriptionEn:
			"Screen replacement, board soldering, unlocking, laptop hardware fix.",
		descriptionFr:
			"Changement d'écran, soudure carte mère, déblocage, réparation PC.",
		icon: Smartphone,
	},
	{
		id: "mobile-money",
		name: "Mobile Money & Kiosk Agent",
		nameFr: "Agent Mobile Money & Kiosque",
		sector: "Tech & Digital Services",
		sectorFr: "Tech & Services Numériques",
		source: "Bayam-Sellam & Street Tech",
		descriptionEn:
			"Cash-in/cash-out, SIM registration, airtime distribution services.",
		descriptionFr:
			"Dépôt/retrait d'argent, enregistrement SIM, transfert de crédit.",
		icon: CreditCard,
	},
	{
		id: "solar-installer",
		name: "Solar & Security Installer",
		nameFr: "Installateur Solaire & Caméras",
		sector: "Tech & Digital Services",
		sectorFr: "Tech & Services Numériques",
		source: "INS / FNE",
		descriptionEn:
			"Solar panel wiring, inverter setup, CCTV security camera installation.",
		descriptionFr:
			"Panneaux solaires, onduleurs, pose de caméras de surveillance CCTV.",
		icon: Sun,
	},
	{
		id: "ac-tech",
		name: "AC & Refrigeration Tech",
		nameFr: "Technicien Froid & Climatisation",
		sector: "Tech & Digital Services",
		sectorFr: "Tech & Services Numériques",
		source: "MINEFOP",
		descriptionEn:
			"Air conditioner installation, fridge gas refill, cold room maintenance.",
		descriptionFr:
			"Pose climatiseurs, recharge gaz frigo, maintenance chambres froides.",
		icon: Snowflake,
	},
	{
		id: "software-dev",
		name: "Software & Mobile Developer",
		nameFr: "Développeur Web & Mobile",
		sector: "Tech & Digital Services",
		sectorFr: "Tech & Services Numériques",
		source: "INS / FNE",
		descriptionEn:
			"Websites, mobile apps, database design, custom business software.",
		descriptionFr:
			"Sites web, applications mobiles, bases de données, logiciels de gestion.",
		icon: Code,
	},
	{
		id: "graphic-designer",
		name: "Graphic Designer & Print",
		nameFr: "Infographe & Sérigraphie",
		sector: "Tech & Digital Services",
		sectorFr: "Tech & Services Numériques",
		source: "INS / FNE",
		descriptionEn:
			"Logo design, banners, printing on T-shirts, flyers & business cards.",
		descriptionFr:
			"Conception logos, banderoles, impression T-shirts, cartes de visite.",
		icon: Printer,
	},

	// Sector 4: Fashion, Beauty & Personal Care (Artisanal Chamber / MINEFOP)
	{
		id: "tailor",
		name: "Tailor & Fashion Designer",
		nameFr: "Couturier & Styliste",
		sector: "Fashion, Beauty & Crafts",
		sectorFr: "Mode, Beauté & Artisanat",
		source: "Artisanal Chamber (CMA)",
		descriptionEn:
			"African print (Pagne/Kaba) sewing, suit tailoring, embroidery.",
		descriptionFr:
			"Couture tenues traditionnelles (Pagne/Kaba), costumes, broderie.",
		icon: Shirt,
	},
	{
		id: "hairdresser",
		name: "Hairdresser & Barber",
		nameFr: "Coiffeur(se) & Esthéticienne",
		sector: "Fashion, Beauty & Crafts",
		sectorFr: "Mode, Beauté & Artisanat",
		source: "Artisanal Chamber (CMA)",
		descriptionEn:
			"Hair braiding, locks maintenance, barber cuts, makeup & pedicure.",
		descriptionFr:
			"Tresses africaines, locks, coupes homme, maquillage & pédicure.",
		icon: Scissors,
	},
	{
		id: "shoemaker",
		name: "Shoemaker & Leather Craftsman",
		nameFr: "Cordonnier & Artisan Cuir",
		sector: "Fashion, Beauty & Crafts",
		sectorFr: "Mode, Beauté & Artisanat",
		source: "Artisanal Chamber (CMA)",
		descriptionEn:
			"Leather shoe crafting, handbag repairs, belt & shoe resoling.",
		descriptionFr:
			"Fabrication chaussures en cuir, réparation sacs, réfection semelles.",
		icon: Footprints,
	},

	// Sector 5: Trade, Agriculture & Food Services (Bayam-Sellam / FNE / INS)
	{
		id: "bayam-sellam",
		name: "Bayam-Sellam & Produce Trader",
		nameFr: "Bayam-Sellam & Vivres Frais",
		sector: "Trade, Agriculture & Food",
		sectorFr: "Commerce, Agriculture & Alimentation",
		source: "Bayam-Sellam & Street Tech",
		descriptionEn:
			"Wholesale supply of fresh agricultural produce (Plantain, Cassava, Veggies).",
		descriptionFr:
			"Approvisionnement en gros vivres frais (Plantain, Manioc, Léguemerie).",
		icon: ShoppingBag,
	},
	{
		id: "agro-processor",
		name: "Agro-Processor & Agribusiness",
		nameFr: "Transformation Agroalimentaire",
		sector: "Trade, Agriculture & Food",
		sectorFr: "Commerce, Agriculture & Alimentation",
		source: "INS / FNE",
		descriptionEn:
			"Cassava flour processing, cocoa/coffee processing, fruit juice packaging.",
		descriptionFr:
			"Transformation manioc/tapioca, cacao/café, jus de fruits naturels.",
		icon: Wheat,
	},
	{
		id: "caterer",
		name: "Event Caterer & Chef",
		nameFr: "Traiteur & Cuisinier",
		sector: "Trade, Agriculture & Food",
		sectorFr: "Commerce, Agriculture & Alimentation",
		source: "Artisanal Chamber (CMA)",
		descriptionEn:
			"Cameroonian traditional & continental cooking for weddings & events.",
		descriptionFr:
			"Cuisine traditionnelle camerounaise & continentale pour mariages & événements.",
		icon: Utensils,
	},

	// Sector 6: General Services & Maintenance
	{
		id: "cleaning",
		name: "Cleaning & Pest Control",
		nameFr: "Nettoyage & Désinfection",
		sector: "Services & Maintenance",
		sectorFr: "Services & Maintenance",
		source: "INS / FNE",
		descriptionEn:
			"Home & office cleaning, fumigation against insects & rodents.",
		descriptionFr:
			"Nettoyage bureaux/domiciles, démoustication & dératisation.",
		icon: Sparkles,
	},
	{
		id: "security",
		name: "Security & Guarding",
		nameFr: "Gardiennage & Sécurité",
		sector: "Services & Maintenance",
		sectorFr: "Services & Maintenance",
		source: "INS / FNE",
		descriptionEn:
			"Nightwatchmen, property security guards, event crowd safety.",
		descriptionFr:
			"Vigiles de nuit, gardiennage de concessions, sécurité événementielle.",
		icon: Shield,
	},
	{
		id: "other",
		name: "Other",
		nameFr: "Autre",
		sector: "Services & Maintenance",
		sectorFr: "Services & Maintenance",
		source: "MINEFOP",
		descriptionEn: "Other specialized manual trades & artisanal services.",
		descriptionFr:
			"Autres métiers manuels & prestations artisanales spécialisées.",
		icon: MoreHorizontal,
	},
];

// String array of category names for backwards compatibility
export const SKILL_CATEGORIES = CAMEROON_SKILLS.map((item) => item.name);

// Lucide Icons record by skill name
export const CATEGORY_ICONS: Record<
	string,
	React.ComponentType<{ className?: string }>
> = CAMEROON_SKILLS.reduce(
	(acc, skill) => {
		acc[skill.name] = skill.icon;
		acc[skill.nameFr] = skill.icon;
		return acc;
	},
	{} as Record<string, React.ComponentType<{ className?: string }>>,
);

// Sector names list
export const SKILL_SECTORS_EN = Array.from(
	new Set(CAMEROON_SKILLS.map((s) => s.sector)),
);

export const SKILL_SECTORS_FR = Array.from(
	new Set(CAMEROON_SKILLS.map((s) => s.sectorFr)),
);
