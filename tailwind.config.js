module.exports = {
	content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	safelist: [
		"lg:w-1/3",
		"lg:w-1/4",
		"bg-hair-lightblue",
		"bg-hair-gray",
		"bg-hair-yellow",
		"bg-hair-green",
		"bg-hair-purple",
		"bg-hair-blue",
		"bg-hair-red",
		"bg-hair-brown",
		"bg-hair-black",
		"bg-skin-0",
		"bg-skin-1",
		"bg-skin-2",
		"bg-skin-3",
		"bg-skin-4",
		"bg-skin-5",
		"bg-skin-6",
		"bg-skin-7",
		"bg-skin-8",
		"bg-skin-9",
		"bg-skin-10",
		"bg-clothing-white",
		"bg-clothing-lightblue",
		"bg-clothing-yellow",
		"bg-clothing-tan",
		"bg-clothing-forest",
		"bg-clothing-darkgreen",
		"bg-clothing-green",
		"bg-clothing-burnt",
		"bg-clothing-red",
		"bg-clothing-blue",
		"bg-clothing-peach",
		"bg-clothing-orange",
		"bg-clothing-black",
		"bg-background-gray",
		"bg-background-stone",
		"bg-background-sand",
		"bg-background-orange",
		"bg-background-yellow",
		"bg-background-red",
		"bg-background-purple",
		"bg-background-blue",
	],
	theme: {
		extend: {
			fontFamily: {
				display: ["Beni"],
			},
			transitionDuration: {
				0: "0ms",
			},
			colors: {
				black: "#19230b",
				hair: {
					lightblue: "#a6d3d1",
					gray: "#bfbaac",
					yellow: "#eda63e",
					green: "#929a7b",
					purple: "#8a748c",
					blue: "#48606c",
					red: "#bb5a23",
					brown: "#863b11",
					black: "#252431",
				},
				skin: {
					0: "#fde7ce",
					1: "#f7eac2",
					2: "#fbe0c0",
					3: "#ffd3bb",
					4: "#ebbba6",
					5: "#f7be93",
					6: "#ba8172",
					7: "#986750",
					8: "#93584c",
					9: "#c45c60",
					10: "#653c2a",
				},
				clothing: {
					white: "#f8f1e6",
					lightblue: "#a3c0bf",
					yellow: "#eec552",
					tan: "#cc8c60",
					forest: "#707d50",
					darkgreen: "#5b5e58",
					green: "#4ba467",
					burnt: "#e35555",
					red: "#fe352b",
					blue: "#0436e8",
					peach: "#e9885e",
					orange: "#fe744d",
					black: "#453d4b",
				},
				background: {
					gray: "#d6d4d0",
					stone: "#c1b6a8",
					sand: "#e5dab3",
					orange: "#f57d6c",
					yellow: "#f7d373",
					red: "#fa615b",
					purple: "#5c6489",
					blue: "#556b79",
				},
				default: {
					black: "#19230b",
					white: "#f8f1e6",
					red: "#fa615b",
					yellow: "#f7d373",
					blue: "#556b79",
					gray: "#f5f7f3",
				},
				ui: {
					black: {
						default: "#443D4A",
						lighter: "#4C4254",
						lightest: "#5D5365",
						darker: "#39333C",
					},
					orange: {
						default: "#fa615b",
					},
				},
			},
			maxHeight: {
				"2/3-screen": "66vh",
				"1/2-screen": "50vh",
				"1/3-screen": "33vh",
			},
			minHeight: {
				20: "5rem",
			},
			height: {
				"1/2-screen": "50vh",
			},
		},
	},
	plugins: [require("@tailwindcss/forms")],
};
