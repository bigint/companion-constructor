import { colors } from "../colors";
import { AttributeDictionary } from "../types";

export const face: AttributeDictionary = {
	name: "face",
	needsTranslation: true,
	variants: [
		{
			restrictions: {
				gender: "m",
			},
			layers: [
				{
					path: "face/01-base/mhead_1-g_m-v_skin.png",
					colorType: "skin",
				},
				{
					path: "face/01-base/mhead_2-c_skin-b_multiply.png",
					color: colors.skin["1"],
					blendMode: "multiply",
				},
			],
		},
		{
			restrictions: {
				gender: "f",
			},
			layers: [
				{
					path: "face/01-base/fhead_1-g_f-v_skin.png",
					colorType: "skin",
				},
				{
					path: "face/01-base/fhead_2-c_skin-b_multiply.png",
					color: colors.skin["1"],
					blendMode: "multiply",
				},
			],
		},
	],
};
