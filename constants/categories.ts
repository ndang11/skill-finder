// constants/categories.ts
import {
	Construction,
	Flame,
	Hammer,
	MoreHorizontal,
	Palette,
	Scissors,
	Settings,
	Shirt,
	Snowflake,
	Sun,
	Wrench,
	Zap,
} from "lucide-react";
import type React from "react";

export const SKILL_CATEGORIES = [
	"Electrician",
	"Plumber",
	"Mechanic",
	"Carpenter",
	"Solar Installer",
	"AC Technician",
	"Mason/Bricklayer",
	"Painter",
	"Welder",
	"Hairdresser",
	"Tailor/Fashion Designer",
	"Other",
];

export const SKILL_CATEGORY_EMOJIS: Record<string, string> = {
	Electrician: "⚡",
	Plumber: "🔧",
	Mechanic: "🔩",
	Carpenter: "🪵",
	"Solar Installer": "☀️",
	"AC Technician": "❄️",
	"Mason/Bricklayer": "🏗️",
	Painter: "🎨",
	Welder: "🔥",
	Hairdresser: "💇",
	"Tailor/Fashion Designer": "👗",
	Other: "🛠️",
};

export const CATEGORY_ICONS: Record<
	string,
	React.ComponentType<{ className?: string }>
> = {
	Electrician: Zap,
	Plumber: Wrench,
	Mechanic: Settings,
	Carpenter: Hammer,
	"Solar Installer": Sun,
	"AC Technician": Snowflake,
	"Mason/Bricklayer": Construction,
	Painter: Palette,
	Welder: Flame,
	Hairdresser: Scissors,
	"Tailor/Fashion Designer": Shirt,
	Other: MoreHorizontal,
};
