import { selectableAttributes, selectableAttributesArray } from "./attributes";
import { colors } from "./colors";
import { companionExample } from "./example";
import { poses } from "./poses";
import {
	AttributeSelection,
	AttributeType,
	Companion,
	Layer,
	LayerStaticWithData,
	LayerWithData,
	Pose,
	Restrictions,
	RGBColor,
	Variant,
} from "./types";

const getVariants = (companion: Companion): Variant[] => {
	const pose = poses[companion.properties.pose];
	return pose.map((attribute) => {
		let selection: AttributeSelection | undefined;
		let match = attribute.variants.find((variant) => {
			if (companion.attributes[attribute.name]?.name) {
				let isMatch = variant.name === companion.attributes[attribute.name].name;
				if (isMatch) {
					selection = companion.attributes[attribute.name];
				}
				return isMatch;
			}
			if (variant.restrictions?.gender) {
				if (variant.restrictions.gender != companion.properties.gender) {
					return false;
				}
			}
			if (variant.restrictions?.pose) {
				if (variant.restrictions.pose != companion.properties.pose) {
					return false;
				}
			}
			return !attribute.isOptional;
		});
		return match;
	});
};

export const getLayers = (companion: Companion) => {
	const pose = poses[companion.properties.pose];

	const variants = getVariants(companion);

	const notRendered = variants.reduce((prev: AttributeType[], curr): AttributeType[] => {
		if (curr?.hides && curr.hides.length) {
			prev.push(...curr.hides);
		}
		return prev;
	}, []);

	let layers: [Layer, AttributeSelection?, boolean?][] = [];
	pose
		.filter((attribute) => {
			return !notRendered.includes(attribute.name);
		})
		.forEach((attribute) => {
			let selection: AttributeSelection | undefined;
			let match = attribute.variants.find((variant) => {
				if (companion.attributes[attribute.name]?.name) {
					let isMatch = variant.name === companion.attributes[attribute.name].name;
					if (isMatch) {
						selection = companion.attributes[attribute.name];
					}
					return isMatch;
				}
				if (variant.restrictions?.gender) {
					if (variant.restrictions.gender != companion.properties.gender) {
						return false;
					}
				}
				if (variant.restrictions?.pose) {
					if (variant.restrictions.pose != companion.properties.pose) {
						return false;
					}
				}
				return !attribute.isOptional;
			});
			if (match) {
				let colorIndexCount = 0;
				match.layers.forEach((layer) => {
					let result: [Layer, AttributeSelection?, boolean?] = [
						layer,
						"colorType" in layer && layer.colorType === "clothing"
							? { ...selection, colorIndex: colorIndexCount++ }
							: selection,
						attribute.needsTranslation,
					];
					if (typeof layer.path !== "string" && !layer.path[companion.properties.pose]) {
						return false;
					}
					layers.push(result);
				});
			}
		});
	return layers;
};

let colorCount = 0;
export const getColor = (
	layer: Layer,
	companion?: Companion,
	selection?: AttributeSelection
): RGBColor => {
	if (!("colorType" in layer)) {
		throw new Error(`Can't get color for layer: ${layer.path}`);
	}
	switch (layer.colorType) {
		case "hair":
		case "skin":
		case "background":
			if (!companion) {
				throw new Error(`No Companion was specified for layer: ${layer.path}`);
			}
			return companion.properties[layer.colorType];
		case "clothing":
			if (!selection.color) {
				throw new Error(`No colors were specified for layer: ${layer.path}`);
			}
			const temp =
				selection.color[
					selection.colorIndex || selection.colorIndex == 0
						? selection.colorIndex
						: colorCount++
				];
			if (colorCount >= selection.color.length) {
				colorCount = 0;
			}
			return temp;
		default:
			return colors.default.black;
	}
};

export const getPath = (layer: Layer, pose?: Pose): string => {
	if (typeof layer.path == "string") {
		return layer.path;
	} else {
		return layer.path[pose];
	}
};

export const colorsRequired = (attributeName: string, variantName: string): number => {
	let attrMatch = selectableAttributesArray.find(
		(attribute) => attribute.name === attributeName
	);
	let variantMatch = attrMatch.variants.find((variant) => variant.name === variantName);
	return variantMatch?.layers.filter((layer) => {
		if ("colorType" in layer) {
			return layer.colorType === "clothing";
		}
		return false;
	}).length;
};

export const colorToKey = (
	color: RGBColor,
	colorObject: { [key: string]: RGBColor }
): string => {
	if (!color) {
		debugger;
	}
	for (const key in colorObject) {
		if (
			colorObject[key].r === color.r &&
			colorObject[key].g === color.g &&
			colorObject[key].b === color.b
		) {
			return key;
		}
	}
	return "";
};

const hasConflict = (
	sourceRestriction: Restrictions,
	companionRestrictions: Restrictions[]
): boolean => {
	return companionRestrictions.some((cRestriction) => {
		for (const rkey in cRestriction) {
			if (sourceRestriction[rkey] && sourceRestriction[rkey] !== cRestriction[rkey]) {
				return true;
			}
		}
		return false;
	});
};

export const isCompatible = (
	restrictions: Restrictions,
	companionRestrictions: Restrictions[]
): boolean => {
	if (!restrictions) {
		return true;
	}
	if (restrictions) {
		if (hasConflict(restrictions, companionRestrictions)) {
			return false;
		}
	}
	return true;
};

export const getRestrictions = (companion: Companion): Restrictions[] => {
	if (!companion) {
		return [];
	}
	const restrictions: Restrictions[] = [
		{
			gender: companion.properties.gender,
			pose: companion.properties.pose,
		},
	];
	for (const key in companion.attributes) {
		const match = selectableAttributes[key].variants.find((variant) => {
			return variant.name === companion.attributes[key]?.name;
		});
		if (match?.restrictions && isCompatible(match.restrictions, restrictions)) {
			restrictions.push(match.restrictions);
		}
	}
	return restrictions;
};

export const flattenCompanion = (
	companion: Companion
): {
	[key: string]: any;
} => {
	let flatCompanion = {};

	for (const key in companion.properties) {
		switch (key) {
			case "pose":
			case "gender":
				flatCompanion[key] = companion.properties[key].toString();
				break;
			case "background":
			case "hair":
			case "skin":
				flatCompanion[key + "Color"] = colorToKey(companion.properties[key], colors[key]);
				break;
		}
	}
	for (const key in companion.attributes) {
		const attribute = selectableAttributes[key];
		const variant = attribute.variants.find(
			(variant) => variant.name === companion.attributes[key].name
		);
		if (variant) {
			flatCompanion[key] = variant.name;
			let colorsString = "";
			let i = 0;
			for (const layer of variant.layers) {
				if ("colorType" in layer && layer.colorType === "clothing") {
					if (colorsString.length) {
						colorsString += ",";
					}
					colorsString += colorToKey(companion.attributes[key].color[i], colors.clothing);
					i++;
				}
			}
			if (colorsString.length) flatCompanion[key + "Colors"] = colorsString;
		}
	}
	return flatCompanion;
};

export const companionToUrl = (companion: Companion): string => {
	let path = "";
	for (const key in companion.properties) {
		switch (key) {
			case "pose":
			case "gender":
				path += `${key}=${companion.properties[key]}&`;
				break;
			case "background":
			case "hair":
			case "skin":
				path += `${key}Color=${colorToKey(companion.properties[key], colors[key])}&`;
				break;
		}
	}
	for (const key in companion.attributes) {
		if (!companion.attributes[key]?.name) {
			continue;
		}
		const attribute = selectableAttributes[key];
		const variant = attribute.variants.find(
			(variant) => variant.name === companion.attributes[key].name
		);
		if (variant) {
			path += `${key}=${variant.name}&`;
			let i = 0;
			for (const layer of variant.layers) {
				if ("colorType" in layer && layer.colorType === "clothing") {
					path += `${key}Color${i + 1}=${colorToKey(
						companion.attributes[key].color[i],
						colors.clothing
					)}&`;
					i++;
				}
			}
		}
	}
	return path;
};

const colorRegEx = /Color\d/g;

export const apiToKeys = (data) => {
	const {
		id,
		createdAt,
		updatedAt,
		hairColors,
		headwearColors,
		eyewearColors,
		maskColors,
		topColors,
		bottomColors,
		shoesColors,
		...rest
	} = data;
	const colors: {
		[key in string]: string;
	} = {
		hair: hairColors,
		headwear: headwearColors,
		eyewear: eyewearColors,
		mask: maskColors,
		top: topColors,
		bottom: bottomColors,
		shoes: shoesColors,
	};
	for (const key of Object.keys(colors)) {
		// split colors string at commas, remove spaces, and convert to array
		if (!colors[key]) continue;
		const colorArray = [];
		colors[key].split(",").forEach((color) => {
			colorArray.push(color.trim());
		});
		if (colorArray.length) {
			colorArray.forEach((color, i) => {
				rest[`${key}Color${i + 1}`] = color;
			});
		}
	}
	return rest;
};

export const keysToCompanion = (companionQuery): Companion => {
	const companion: Companion = {
		name: null,
		properties: { ...companionExample.properties },
		attributes: {
			hair: { name: "crop" },
			eyes: { name: "open" },
			brows: { name: "bushy" },
			mouth: { name: "handlebars" },
			nose: { name: "hook" },
		},
	};
	for (const key in companionQuery) {
		if (typeof companionQuery[key] !== "string") {
			continue;
		}
		switch (key) {
			case "pose":
				if (!((companionQuery[key] as string) in Pose)) {
					throw new Error(`${key} not valid`);
				}
				companion.properties.pose = Number(companionQuery[key]);
				break;
			case "gender":
				if (companionQuery[key] !== "f" && companionQuery[key] !== "m") {
					throw new Error(`${key} not valid`);
				}
				companion.properties.gender = companionQuery[key] as "m" | "f";
				break;
			case "skinColor":
			case "hairColor":
			case "backgroundColor":
				const propName = key.replace("Color", "");
				const color = colors[propName][companionQuery[key] as string];
				if (!color) {
					throw new Error(`${key} not valid`);
				}
				companion.properties[propName] = color;
				break;
			default:
				if (key.match(colorRegEx)) {
					continue;
				}
				if (!(key in selectableAttributes)) {
					throw new Error(`${key} not valid`);
				}
				const match = selectableAttributes[key].variants.find(
					(variant) => variant.name === companionQuery[key]
				);
				if (!match) {
					throw new Error(`${key}: ${companionQuery[key]} not valid`);
				}
				companion.attributes[key] = {
					name: companionQuery[key],
				};
				let i = 1;
				let colorList: RGBColor[] = [];
				while (companionQuery[key + "Color" + i]) {
					colorList.push(colors.clothing[companionQuery[key + "Color" + i++] as string]);
				}
				if (colorList.length > 0) {
					companion.attributes[key].color = colorList;
				}
		}
	}
	return companion;
};

export const drawLayer = ({
	companion,
	canvas,
	layers,
	drawIndex,
	recurseBatches,
	paint,
	createCanvas,
	replaceColor,
	translateImage,
}: {
	companion: Companion;
	canvas: HTMLCanvasElement | Buffer;
	layers: [LayerWithData, AttributeSelection?, boolean?][];
	drawIndex: number;
	recurseBatches?: boolean;
	paint: (
		input: HTMLImageElement | HTMLCanvasElement | Buffer,
		target: HTMLCanvasElement | Buffer,
		blendMode?: "source-over" | "multiply" | "destination-over"
	) => HTMLImageElement | HTMLCanvasElement | Buffer;
	createCanvas: () => HTMLCanvasElement | Buffer;
	replaceColor: (
		input: HTMLImageElement | HTMLCanvasElement | Buffer,
		color: RGBColor
	) => HTMLImageElement | HTMLCanvasElement | Buffer;
	translateImage: (
		input: HTMLImageElement | HTMLCanvasElement | Buffer,
		pose: Pose
	) => HTMLImageElement | HTMLCanvasElement | Buffer;
}): HTMLImageElement | HTMLCanvasElement | Buffer => {
	const [layer, selection, needsTranslation] = layers[drawIndex];
	let imageToDraw: HTMLImageElement | HTMLCanvasElement | Buffer;

	if (layer.batch && recurseBatches) {
		const tempCanvas = createCanvas();

		const batchIndices = layers.reduce<number[]>((indices, curr, k) => {
			if (curr[0].batch === layer.batch) {
				indices.push(k);
			}
			return indices;
		}, []);

		const batchLayers = layers
			.map((l, k) => {
				if ("colorType" in l[0] && l[0].colorType === "inherit") {
					const { colorType, ...rest } = l[0];
					return [
						{
							color: getColor(layers[k + 1][0], companion, layers[k + 1][1]),
							...rest,
						} as LayerStaticWithData,
						l[1],
						l[2],
					] as [LayerStaticWithData, AttributeSelection?, boolean?];
				}
				return l;
			})
			.filter((_, i) => batchIndices.includes(i));

		if (batchLayers.length) {
			batchLayers.forEach((_, j) => {
				drawLayer({
					companion,
					canvas: tempCanvas,
					layers: batchLayers,
					drawIndex: j,
					paint,
					createCanvas,
					replaceColor,
					translateImage,
				});
			});
		}
		imageToDraw = tempCanvas;
	} else {
		let color: RGBColor | undefined;
		if ("color" in layer) {
			color = layer.color;
		} else if ("colorType" in layer) {
			if (layer.colorType == "inherit") {
				color = getColor(layers[drawIndex + 1][0], companion, layers[drawIndex + 1][1]);
			} else {
				color = getColor(layer, companion, selection);
			}
		}
		imageToDraw = color ? replaceColor(layer.imgData, color) : layer.imgData;
		imageToDraw = needsTranslation
			? translateImage(imageToDraw, companion.properties.pose)
			: imageToDraw;
	}

	if (!imageToDraw) throw new Error("No image returned");
	return paint(imageToDraw, canvas, layer.blendMode);
};
