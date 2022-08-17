const createSsmlXmlTextEn = require("./robots/AzureTTS/utils");

const robots = {
	BrainyQuote: require("./robots/BrainyQuote/index"),
	createSsmlVoice: require("./robots/AzureTTS/index").createSsmlVoice,
};

const startRobots = () => {
	robots.BrainyQuote();
};

module.exports = startRobots;
