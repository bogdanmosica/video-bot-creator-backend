import { interpolate } from "remotion";

import { QuotationMark } from "./QuotationMark";

/**
 * ! TODO
 * * Extend with different animation types
 * * Document better
 * @param {style} props.style the style property for component
 * @returns a "" mark big with animations
 */
export const QuotationMarkBottom = ({ style, frame }) => {
	const translateX = interpolate(frame, [0, 10], [500, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<QuotationMark
			style={{
				...style,
				transform: `scale(0.7) translateX(${translateX}px)`,
				bottom: "245px",
				right: "210px",
			}}
		/>
	);
};
