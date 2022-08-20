import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
	Easing,
} from "remotion";
import { AuthorName } from "./AuthorName";

import { QuotationMarkTop } from "./QuotationMarkTop";
import { QuotationMarkBottom } from "./QuotationMarkBottom";
import { HorizontalLine } from "../components/HorizontalLine";
import { VerticalLine } from "../components/VerticalLine";

import { AnimationTypes } from "../components/constants";
import { AuthorQuote } from "./AuthorQuote";

export const QuoteContainer = ({ color, backgroundColor, textColor }) => {
	const frame = useCurrentFrame();

	const opacity = interpolate(frame, [0, 10], [0.2, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill className="QuoteContainer" style={{ backgroundColor }}>
			<AuthorQuote textColor={textColor} />
			{/* Top QuotationMark */}
			<QuotationMarkTop style={{ opacity, color }} frame={frame} />
			{/* Bottom QuotationMark */}
			<QuotationMarkBottom style={{ opacity, color }} frame={frame} />
			{/* Horizontal Line */}
			<HorizontalLine
				style={{ backgroundColor: color }}
				frame={frame}
				animationType={AnimationTypes.FromBottom}
				value={320}
			/>
			{/* Vertical Line */}
			<VerticalLine
				style={{ backgroundColor: color }}
				frame={frame}
				animationType={AnimationTypes.FromLeft}
				value={200}
			/>
			<AuthorName color={color} textColor={textColor} />
		</AbsoluteFill>
	);
};
