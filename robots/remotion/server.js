const path = require("path");
const { bundle } = require("@remotion/bundler");
const { getCompositions, renderMedia } = require("@remotion/renderer");

const createVideoFile = async ({
	compositionId = "QuotesExample",
	entry = "robots/remotion/index.js",
	videoName = "video",
	videoPath = "",
	props = {},
}) => {
	// You only have to do this once, you can reuse the bundle.
	const entry = "robots/remotion/index.js";
	console.log("Creating a Webpack bundle of the video");

	const bundleLocation = await bundle(path.resolve(entry), () => undefined, {
		// If you have a Webpack override, make sure to add it here
	});

	// Extract all the compositions you have defined in your project
	// from the webpack bundle.
	const comps = await getCompositions(bundleLocation, {
		// You can pass custom input props that you can retrieve using getInputProps()
		// in the composition list. Use this if you want to dynamically set the duration or
		// dimensions of the video.
		props,
	});

	// Select the composition you want to render.
	const composition = comps.find((c) => c.id === compositionId);

	// Ensure the composition exists
	if (!composition) {
		throw new Error(`No composition with the ID ${compositionId} found.
  Review "${entry}" for the correct ID.`);
	}

	const outputLocation = videoPath
		? path.resolve(`videoPath/${videoName}.mp4`)
		: path.resolve(`out/${videoName}.mp4`);

	console.log("Attempting to render:", outputLocation);
	await renderMedia({
		composition,
		serveUrl: bundleLocation,
		codec: "h264",
		outputLocation,
		props,
	});
	console.log("Render done!");
};

module.exports = createVideoFile;
