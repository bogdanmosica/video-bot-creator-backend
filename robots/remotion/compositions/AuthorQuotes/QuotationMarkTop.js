import { interpolate } from "remotion";

import { QuotationMark } from "./QuotationMark";

/**
 * ! TODO
 * * Extend with different animation types
 * * Document better
 * @param {style} props.style the style property for component
 * @returns a "" mark big with animations
 */
export const QuotationMarkTop = ({ style, frame }) => {
	const translateY = interpolate(frame, [0, 10], [280, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<QuotationMark
			style={{
				...style,
				transform: `rotate(180deg) translateY(${translateY}px)`,
				top: "400px",
				left: "70px",
			}}
		/>
	);
};
