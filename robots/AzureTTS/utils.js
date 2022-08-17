const { SsmlVoiceStyles, EnglishNeuralVoices } = require("./constants");
/**
 *
 * @param {String} text the text that will be a speech
 * @param {EnglishNeuralVoices} voice any value from EnglishNeuralVoices
 * @param {SsmlVoiceStyles} style any value from SsmlVoiceStyles
 * @returns a xml string that can be passed to synthesizer.speakSsmlAsync function
 */
const createSsmlXmlTextEn = (
	text,
	voice = EnglishNeuralVoices.Christopher,
	style = SsmlVoiceStyles.Assistant
) => {
	return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
        <voice name="${voice}">
            <mstts:express-as style="${style}">
                ${text}
            </mstts:express-as>
        </voice>
    </speak>`;
};

module.exports = createSsmlXmlTextEn;
