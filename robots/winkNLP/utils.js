const nlp = require("wink-nlp-utils");

const getTextWithoutHtmlSpacesSpecialChars = (text) => {
	let textWithOutHtmlMarkup = nlp.string.removeHTMLTags(text);

	textWithOutHtmlMarkup = nlp.string.removeExtraSpaces(textWithOutHtmlMarkup);

	return textWithOutHtmlMarkup;
};

module.exports = getTextWithoutHtmlSpacesSpecialChars;
