import { useEffect, useRef, useState } from "react";
import Button from "../components/button";
import Editor from "../components/editor";
import Marketing from "../components/marketing";
import Renderer from "../components/renderer";
import { colors } from "../data/colors";
import { colorToKey } from "../data/helpers";
import { randomCompanion } from "../data/random";
import { Companion } from "../data/types";

const MyCompanions = ({ callback }: { callback: () => void }) => {
	let variant, active;
	return (
		<div className="fixed z-40 flex flex-col left-4 top-4 p-4 bg-white rounded-xl overflow-y-scroll hide-scrollbar shadow-medium">
			<h2>My companions</h2>

			<div
				className={`font-semibold flex justify-center content-center cursor-pointer min-h-20 rounded-xl  hover:text-gray-800  border-4 border-transparent ${
					variant === active ? "border-black bg-hair-lightblue" : "hover:bg-gray-100 bg-gray-50"
				}`}
				onClick={() => {
					callback();
				}}
			>
				🚫
			</div>
			<div
				className={`font-semibold flex justify-center content-center cursor-pointer min-h-20 rounded-xl  hover:text-gray-800  border-4 border-transparent ${
					false ? "border-black bg-hair-lightblue" : "hover:bg-gray-100 bg-gray-50"
				}`}
				onClick={() => {
					callback();
				}}
			>
				1
			</div>
			<div
				className={`font-semibold flex justify-center content-center cursor-pointer min-h-20 rounded-xl  hover:text-gray-800  border-4 border-transparent ${
					false ? "border-black bg-hair-lightblue" : "hover:bg-gray-100 bg-gray-50"
				}`}
				onClick={() => {
					callback();
				}}
			>
				2
			</div>
			<Button className=" bg-hair-yellow">Claim $COMPANIONSHIP</Button>
			<Button className=" bg-hair-purple">Mint now!</Button>
		</div>
	);
};

export default function Constructor() {
	const [companion, setCompanion] = useState<Companion | null>(null);
	const [connected, setConnected] = useState(false);
	const [customizing, setCustomizing] = useState<boolean>(false);
	const scrollableArea = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setCompanion(randomCompanion());
	}, []);

	if (!companion) {
		return <>Loading..</>;
	}

	return (
		<>
			<div
				ref={scrollableArea}
				className={`font-mono z-10 fixed inset-0 h-screen w-screen overflow-x-hidden ${
					customizing ? "lg:overflow-y-hidden" : ""
				}`}
			>
				{customizing ? (
					<>
						<div className="fixed z-10 space-x-2 left-0 top-0 p-4">
							<Button
								className="bg-hair-lightblue"
								onClick={() => {
									setCustomizing(false);
								}}
							>
								← Back
							</Button>
						</div>
						<div className="absolute lg:fixed pt-14 lg:right-4 w-full lg:w-1/3 lg:pt-12 lg:h-full lg:pb-28">
							{/* eslint-disable */}
							<img
								src="/attributes/pose1/00-background/bg-v_background.png"
								className="w-full max-h-2/3-screen opacity-0 lg:hidden"
								aria-hidden="true"
							/>
							{/* eslint-enable */}
							<div className="bg-white rounded-t-xl min-h-full lg:rounded-xl lg:max-h-full lg:overflow-y-scroll hide-scrollbar shadow-medium">
								<Editor companionState={[companion, setCompanion]} />
							</div>
						</div>
					</>
				) : (
					<>
						<div className="fixed z-40 flex right-0 top-0 p-4">
							<Button
								className="bg-hair-yellow"
								onClick={() => {
									setConnected((prev) => !prev);
								}}
							>
								{connected ? "Disconnect your wallet" : "Connect your wallet"}
							</Button>
						</div>
						{connected ? (
							<>
								<MyCompanions
									callback={() => {
										scrollableArea.current?.scrollTo({ top: 0, behavior: "smooth" });
									}}
								/>

								<div className="fixed z-10 flex flex-wrap w-screen justify-center bottom-24 lg:bottom-24">
									<Button
										className="bg-clothing-orange"
										onClick={() => {
											setCustomizing(true);
											scrollableArea.current?.scrollTo(0, 0);
										}}
									>
										Customize
									</Button>
								</div>
							</>
						) : (
							<div className="fixed z-10 flex flex-wrap w-screen justify-center bottom-24 lg:bottom-24">
								<Button
									className="bg-hair-lightblue"
									onClick={() => {
										setCompanion(randomCompanion());
									}}
								>
									Randomize
								</Button>

								<Button
									className="bg-clothing-orange"
									onClick={() => {
										setCustomizing(true);
										scrollableArea.current?.scrollTo({ top: 0, behavior: "smooth" });
									}}
								>
									Customize
								</Button>
							</div>
						)}
					</>
				)}
				<div className="h-screen pointer-events-none">&nbsp;</div>
				<div
					className={`transform-gpu transition-opacity duration-1000 relative z-30 min-h-screen w-screen -mt-12 p-2 md:px-8 lg:px-16 xl:px-32 ${
						customizing ? "pointer-events-none opacity-0 duration-75 " : ""
					}`}
				>
					<div className="w-full min-h-full bg-clothing-white rounded-xl shadow-2xl px-4 lg:px-8 py-16 max-w-6xl mx-auto text-lg grid-cols-1 md:grid-cols-5 items-center mb-8 flex justify-center">
						<Button className="bg-hair-lightblue">View on OpenSea</Button>
					</div>
					<Marketing />
				</div>
			</div>
			<div
				className={`font-mono h-screen transition-colors bg-background-${colorToKey(
					companion.properties.background,
					colors.background
				)}`}
			>
				<div
					className={`transition-all fixed w-screen z-0 lg:h-full flex justify-center left-0 lg:top-0 ${
						customizing ? "top-14 lg:w-2/3" : "pb-24 h-full w-screen"
					}`}
				>
					<Renderer showTitle={!customizing} companion={companion} />
				</div>
			</div>
		</>
	);
}
