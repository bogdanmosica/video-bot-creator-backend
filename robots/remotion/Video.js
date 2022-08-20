import React from "react";
import { Composition } from "remotion";
import { MyComposition } from "./compositions/Composition";

export const RemotionVideo = () => {
	return (
		<>
			<Composition
				id="QuotesExample"
				component={MyComposition}
				durationInFrames={140}
				fps={30}
				width={1080}
				height={1920}
			/>
		</>
	);
};
