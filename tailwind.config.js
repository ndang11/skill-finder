/** @type {import('tailwindcss').Config} */
export default {
	content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					50: "#f0fdf4",
					500: "#22c55e", // Vibrant green
					600: "#16a34a",
					700: "#15803d",
				},
			},
		},
	},
	plugins: [],
};
