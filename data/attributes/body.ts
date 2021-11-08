import { colors } from "../colors";
import { AttributeDictionary } from "../types";

export const bodyBack: AttributeDictionary = {
	name: "bodyBack",
	variants: [
		{
			attribute: "bodyBack",
			restrictions: { pose: 1 },
			layers: [
				{
					path: "pose1/01-legs/base_01-v_skin.png",
					colorType: "skin",
				},
				{
					path: "pose1/01-legs/base_02-c_skin-b_multiply.png",

					color: colors.skin["1"],
					blendMode: "multiply",
				},
				{
					path: "pose1/01-legs/base_03-c_outline.png",
					color: colors.default.black,
				},
			],
		},

		{
			attribute: "bodyBack",
			restrictions: { pose: 2 },
			layers: [
				{
					path: "pose2/01-body/base_1-v_skin.png",
					colorType: "skin",
				},
				{
					path: "pose2/01-body/base_2-c_skin-b_multiply.png",
					color: colors.skin["1"],
					blendMode: "multiply",
				},
				{
					path: "pose2/01-body/base_3-c_outline.png",
					color: colors.default.black,
				},
			],
		},

		{
			attribute: "bodyBack",
			restrictions: { pose: 3 },
			layers: [
				{
					path: "pose3/00-torso/base_1-v_skin.png",
					colorType: "skin",
				},
				{
					path: "pose3/00-torso/base_2-c_skin-b_multiply.png",
					color: colors.skin["1"],
					blendMode: "multiply",
				},
			],
		},

		{
			attribute: "bodyBack",
			restrictions: { pose: 4 },
			layers: [
				{
					path: "pose4/01-body/base_1-v_skin.png",
					colorType: "skin",
				},
				{
					path: "pose4/01-body/base_2-c_skin-b_multiply.png",
					color: colors.skin["1"],
					blendMode: "multiply",
				},
				{
					path: "pose4/01-body/base_3-c_outline.png",
					color: colors.default.black,
				},
			],
		},
	],
};
export const bodyFront: AttributeDictionary = {
	name: "bodyFront",
	variants: [
		{
			attribute: "bodyFront",
			restrictions: { pose: 1 },
			layers: [
				{
					path: "pose1/12-torso/base_1-v_skin.png",
					colorType: "skin",
				},
				{
					path: "pose1/12-torso/base_2-c_skin-b_multiply.png",
					color: colors.skin["1"],
					blendMode: "multiply",
				},
				{
					path: "pose1/12-torso/base_3-c_outline.png",
					color: colors.default.black,
				},
			],
		},

		{
			attribute: "bodyFront",
			restrictions: { pose: 2 },
			layers: [
				{
					path: "pose2/04-arms/base_1-v_skin.png",
					colorType: "skin",
				},
				{
					path: "pose2/04-arms/base_2-c_outline.png",
					color: colors.default.black,
				},
			],
		},

		{
			attribute: "bodyFront",
			restrictions: { pose: 3 },
			layers: [
				{
					path: "pose3/09-body/base_1-v_skin.png",
					colorType: "skin",
				},
				{
					path: "pose3/09-body/base_2-c_skin-b_multiply.png",
					color: colors.skin["1"],
					blendMode: "multiply",
				},
				{
					path: "pose3/09-body/base_3-c_outline.png",
					color: colors.default.black,
				},
			],
		},
	],
};
