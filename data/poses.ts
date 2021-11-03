import { background } from "./attributes/background";
import { bodyBack, bodyFront } from "./attributes/body";
import { neck } from "./attributes/neck";
import { face } from "./attributes/face";
import { blemish } from "./attributes/blemish";
import { outline } from "./attributes/outline";
import { hair } from "./attributes/hair";
import { eyes } from "./attributes/eyes";
import { brows } from "./attributes/brows";
import { mouth } from "./attributes/mouth";
import { eyewear } from "./attributes/eyewear";
import { headwear } from "./attributes/headwear";
import { nose } from "./attributes/nose";
import {
	AttributeDictionary,
	AttributeType,
	Composition,
} from "./helpers";

export const attributes: {
	[attribute in AttributeType]: AttributeDictionary;
} = {
	background,
	bodyBack,
	neck,
	face,
	blemish,
	outline,
	hair,
	eyes,
	brows,
	mouth,
	eyewear,
	headwear,
	nose,
	bodyFront,
};

export const poses: Composition[] = [
	{
		name: "pose1",
		restrictions: { pose: 1 },
		attributes: [
			attributes.background,
			attributes.bodyBack,
			attributes.neck,
			attributes.face,
			attributes.blemish,
			attributes.outline,
			attributes.hair,
			attributes.eyes,
			attributes.brows,
			attributes.mouth,
			attributes.eyewear,
			attributes.headwear,
			attributes.nose,
			attributes.bodyFront,
		],
	},
	{
		name: "pose2",
		restrictions: { pose: 2 },
		attributes: [
			attributes.background,
			attributes.bodyBack,
			attributes.neck,
			attributes.face,
			attributes.blemish,
			attributes.outline,
			attributes.hair,
			attributes.eyes,
			attributes.brows,
			attributes.mouth,
			attributes.eyewear,
			attributes.headwear,
			attributes.nose,
			attributes.bodyFront,
		],
	},
	{
		name: "pose3",
		restrictions: { pose: 3 },
		attributes: [
			attributes.background,
			attributes.bodyBack,
			attributes.neck,
			attributes.face,
			attributes.blemish,
			attributes.outline,
			attributes.hair,
			attributes.eyes,
			attributes.brows,
			attributes.mouth,
			attributes.eyewear,
			attributes.headwear,
			attributes.nose,
			attributes.bodyFront,
		],
	},
	{
		name: "pose4",
		restrictions: { pose: 4 },
		attributes: [
			attributes.background,
			attributes.bodyBack,
			attributes.neck,
			attributes.face,
			attributes.blemish,
			attributes.outline,
			attributes.hair,
			attributes.eyes,
			attributes.brows,
			attributes.mouth,
			attributes.eyewear,
			attributes.headwear,
			attributes.nose,
		],
	},
];