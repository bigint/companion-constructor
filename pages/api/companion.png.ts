import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import NodeCache from "node-cache";
import sharp from "sharp";
import { apiToKeys, drawLayer, getLayers, getPath, keysToCompanion } from "../../data/helpers";
import { createCompanion } from "../../data/operations";
import { randomCompanion } from "../../data/random";
import { AttributeSelection, Companion, LayerWithData, Pose, RGBColor } from "../../data/types";
import prisma from "../../lib/prisma";
import { web3 } from "../../lib/web3";

const { w, h } = {
	w: 128,
	h: 128,
};
const ratio = w / 2048;

const imageCache = new NodeCache();
const applyColor = async (input: Buffer, color: RGBColor): Promise<Buffer> => {
	if (!input) return input;
	const result = await sharp(input)
		.composite([
			{
				input: await sharp({
					create: {
						width: w,
						height: h,
						channels: 3,
						background: color,
					},
				})
					.png()
					.toBuffer(),
				blend: "in",
			},
		])
		.toBuffer();
	return result;
};
const applyTransformation = async (input: Buffer, pose: Pose): Promise<Buffer> => {
	let result;
	switch (pose) {
		case 1:
			result = await sharp({
				create: {
					width: w,
					height: h,
					channels: 4,
					background: { r: 255, g: 255, b: 255, alpha: 0 },
				},
			})
				.png()
				.composite([
					{
						input: await sharp(input).flop().toBuffer(),
						top: Math.round(-15 * ratio),
						left: Math.round(-261 * ratio),
					},
				])
				.toBuffer();
			break;
		case 2:
			result = input;
			break;
		case 3:
			result = await sharp({
				create: {
					width: w,
					height: h,
					channels: 4,
					background: { r: 255, g: 255, b: 255, alpha: 0 },
				},
			})
				.png()
				.composite([{ input, left: Math.round(521 * ratio), top: Math.round(-313 * ratio) }])
				.toBuffer();
			break;
		case 4:
			result = await sharp({
				create: {
					width: w,
					height: h,
					channels: 4,
					background: { r: 255, g: 255, b: 255, alpha: 0 },
				},
			})
				.png()
				.composite([
					{
						input: await sharp(input).flip().rotate(90).toBuffer(),
						top: 0,
						left: Math.round(246 * ratio),
					},
				])
				.toBuffer();
			break;
	}
	return result;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Example url query:
	// http://localhost:3000/api/companion.png?pose=2&gender=m&skinColor=0&hairColor=purple&backgroundColor=yellow&hair=crop&eyes=open&brows=bushy&mouth=handlebars&nose=hook&headwear=cap&headwearColor1=red&headwearColor2=blue
	// http://localhost:3000/api/companion.png?pose=2&gender=f&skinColor=0&hairColor=purple&backgroundColor=bga&hair=crop&eyes=dart&brows=bushy&mouth=handlebars&nose=hook&headwear=cap&headwearColor1=red&headwearColor2=blue

	let optimized: Buffer = req.query.refresh ? null : await imageCache.get(req.url);

	if (optimized) {
		console.log(`Successfully used cache for ${req.url}`);
	}

	if (!optimized) {
		const query = req.query;
		let companion: Companion | null;
		const batches: Set<string> = new Set();
		if (query.id && typeof query.id === "string") {
			const result = await prisma.companion.findUnique({
				where: { id: parseInt(query.id) },
			});
			if (!result) {
				res.status(404).send("No companion found");
				return;
				// companion = await createCompanion({
				// 	id: parseInt(query.id),
				// 	companion: randomCompanion(),
				// });
			} else {
				companion = keysToCompanion(apiToKeys(result));
			}
		} else {
			companion = keysToCompanion(query);
		}
		if (!companion?.properties?.pose) {
			res.status(404).send("No companion found");
			return;
		}
		const layers = getLayers(companion);

		const imageBuffers = layers.map(async ([layer]) => {
			const imgBuffer = (
				await axios({
					url: "https://companioninabox.art" + getPath(layer, companion.properties.pose),
					responseType: "arraybuffer",
				})
			).data as Buffer;
			return sharp(imgBuffer).resize(w, h).toBuffer();
		});
		const results = await Promise.all(imageBuffers);

		const layersWithData: [LayerWithData, AttributeSelection?, boolean?][] = layers.map(
			([layer, ...rest], i) => {
				return [
					{
						imgData: results[i],
						...layer,
					},
					...rest,
				];
			}
		);

		const final = await layersWithData.reduce(
			async (canvas, [layer], i) => {
				await canvas;
				if (layer.batch) {
					if (layer.batch?.length && layer.batch.some((item) => batches.has(item))) {
						return canvas;
					}
				}

				const result = await drawLayer({
					companion,
					canvas: await canvas,
					layers: layersWithData,
					drawIndex: i,
					usedBatches: batches,
					paint: (input: Buffer, target: Buffer, blendMode) => {
						const blend = blendMode
							? ((): "multiply" | "dest-over" | "over" => {
									switch (layer.blendMode) {
										case "multiply":
											return "multiply";
										case "destination-over":
											return "dest-over";
										default:
											return "over";
									}
							  })()
							: "over";
						const result = sharp(target).composite([{ input, blend }]).toBuffer();
						return result;
					},
					createCanvas: () => {
						return sharp({
							create: {
								width: w,
								height: h,
								channels: 4,
								background: { r: 255, g: 255, b: 255, alpha: 0 },
							},
						})
							.png()
							.toBuffer();
					},
					replaceColor: applyColor,
					translateImage: applyTransformation,
					debugEscape: async (buffer) => {
						optimized = await sharp(buffer)
							.flatten()
							.png({ compressionLevel: 8, quality: 80 })
							.toBuffer();
						res.setHeader("Content-Type", "image/png");
						res.setHeader("Content-Length", optimized.length);
						res.setHeader("Cache-Control", "public, max-age=31536000");
						res.status(200);
						res.end(optimized);
						return;
					},
					debugDeep: false,
				});
				return result;
			},
			sharp({
				create: {
					width: w,
					height: h,
					channels: 4,
					background: { r: 255, g: 255, b: 255, alpha: 0 },
				},
			})
				.png()
				.toBuffer()
		);

		optimized = await sharp(final as Buffer)
			.flatten()
			.png({ compressionLevel: 8, quality: 80 })
			.toBuffer();

		imageCache.set(req.url, optimized);
	}

	res.setHeader("Content-Type", "image/png");
	res.setHeader("Content-Length", optimized.length);
	res.setHeader("Cache-Control", "public, max-age=31536000");
	res.status(200);
	res.end(optimized);
}
