const createSsmlXmlTextEn = require("./robots/AzureTTS/utils");

const robots = {
	BrainyQuote: require("./robots/brainyQuotes/index"),
	createSsmlVoice: require("./robots/azureTTS/index").createSsmlVoice,
	uploadVideosYouTube: require("./robots/youTubeUploader/index").uploadVideo,
	remotion: require("./robots/remotion/server.js"),
};

const startRobots = () => {
	//robots.BrainyQuote();
	//robots.uploadVideosYouTube();
	robots.remotion();
};

module.exports = startRobots;
