import { allAttributes as attributes } from "./attributes";
import { AttributeDictionary } from "./types";

export const poses: { [key: string]: AttributeDictionary[] } = {
	"1": [
		attributes.bodyBack,
		attributes.bottom,
		attributes.shoes,
		attributes.neck,
		attributes.face,
		attributes.blemish,
		attributes.outline,
		attributes.hair,
		attributes.eyes,
		attributes.brows,
		attributes.mouth,
		attributes.mask,
		attributes.headwear,
		attributes.bodyFront,
		attributes.top,
		attributes.eyewear,
		attributes.nose,
		attributes.background,
	],
	"2": [
		attributes.bodyBack,
		attributes.shoes,
		attributes.bottom,
		attributes.neck,
		attributes.face,
		attributes.blemish,
		attributes.outline,
		attributes.hair,
		attributes.eyes,
		attributes.brows,
		attributes.mouth,
		attributes.mask,
		attributes.headwear,
		attributes.bodyFront,
		attributes.top,
		attributes.eyewear,
		attributes.nose,
		attributes.accessory,
		attributes.background,
	],
	"3": [
		attributes.bodyBack,
		attributes.neck,
		attributes.face,
		attributes.blemish,
		attributes.outline,
		attributes.hair,
		attributes.eyes,
		attributes.brows,
		attributes.mouth,
		attributes.mask,
		attributes.headwear,
		attributes.top,
		attributes.bodyFront,
		attributes.bottom,
		attributes.eyewear,
		attributes.nose,
		attributes.shoes,
		attributes.background,
	],
	"4": [
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
		attributes.background,
	],
};
