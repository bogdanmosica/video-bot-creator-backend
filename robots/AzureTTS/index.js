var sdk = require("microsoft-cognitiveservices-speech-sdk");

const { EnglishNeuralVoices } = require("./constants");

const { AZURE_COGNITIVE_KEY } = process.env;
const key = AZURE_COGNITIVE_KEY;

const region = "westeurope";
const audioFile = "YourAudioFile.wav";

var speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
var audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

// Create the speech synthesizer.
let synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

/**
 *
 * @param {xml string} xml a string in a xml format. Check https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/speech-synthesis-markup?tabs=csharp#adjust-speaking-styles for more information.
 * Created result is saved as "YourAudioFile.wav" in the main structure folder.
 */
const createSsmlVoice = (xml) => {
	if (xml) {
		synthesizer.speakSsmlAsync(
			xml,
			function (result) {
				if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
					console.log("synthesis finished.");
				} else {
					console.error(
						"Speech synthesis canceled, " +
							result.errorDetails +
							"\nDid you set the speech resource key and region values?"
					);
				}
				synthesizer.close();
				synthesizer = null;
			},
			function (err) {
				console.trace("err - " + err);
				synthesizer.close();
				synthesizer = null;
			}
		);
		console.log("Now synthesizing to: " + audioFile);
	} else {
		console.log(
			"You need to provide a xml text. For further details see: https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/speech-synthesis-markup?tabs=csharp"
		);
	}
};

/**
 *
 * @param {string} text a string
 * @param {EnglishNeuralVoices} voice value of type EnglishNeuralVoices
 * Created result is saved as "YourAudioFile.wav" in the main structure folder.
 */
const createTextVoice = (text, voice = EnglishNeuralVoices.Jenny) => {
	// The language of the voice that speaks.
	speechConfig.speechSynthesisVoiceName = voice;

	synthesizer.speakSsmlAsync(
		text,
		function (result) {
			if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
				console.log("synthesis finished.");
			} else {
				console.error(
					"Speech synthesis canceled, " +
						result.errorDetails +
						"\nDid you set the speech resource key and region values?"
				);
			}
			synthesizer.close();
			synthesizer = null;
		},
		function (err) {
			console.trace("err - " + err);
			synthesizer.close();
			synthesizer = null;
		}
	);
	console.log("Now synthesizing to: " + audioFile);
};

module.exports = { createSsmlVoice, createTextVoice };
