const fs = require("fs");
const readline = require("readline");
const assert = require("assert");
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;

const { VideoCategoryIds } = require("./utils");

// If modifying these scopes, delete your previously saved credentials in client_oauth_token.json
const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];
const TOKEN_PATH = "../client_oauth_token.json";

const videoFilePath = "robots/YouTubeUploader/vid.mp4";
const thumbFilePath = "robots/YouTubeUploader/thumb.jpg";

exports.uploadVideo = (title, description, tags) => {
	assert(fs.existsSync(videoFilePath));
	assert(fs.existsSync(thumbFilePath));

	// Load client secrets from a local file.
	fs.readFile(
		"robots/YouTubeUploader/client_secret.json",
		function processClientSecrets(err, content) {
			if (err) {
				console.log("Error loading client secret file: " + err);
				return;
			}
			// Authorize a client with the loaded credentials, then call the YouTube API.
			authorize(JSON.parse(content), (auth) =>
				uploadVideo(auth, title, description, tags)
			);
		}
	);
};
/**
 * Upload the video file.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function uploadVideo(auth, title, description, tags) {
	const service = google.youtube("v3");

	service.videos.insert(
		{
			auth: auth,
			part: "snippet,status",
			requestBody: {
				snippet: {
					title,
					description,
					tags,
					categoryId: VideoCategoryIds.Education,
					defaultLanguage: "en",
					defaultAudioLanguage: "en",
				},
				status: {
					privacyStatus: "private",
				},
			},
			media: {
				body: fs.createReadStream(videoFilePath),
			},
		},
		function (err, response) {
			if (err) {
				console.log("The API returned an error: " + err);
				return;
			}
			console.log(response.data);

			console.log("Video uploaded. Uploading the thumbnail now.");
			service.thumbnails.set(
				{
					auth: auth,
					videoId: response.data.id,
					media: {
						body: fs.createReadStream(thumbFilePath),
					},
				},
				function (err, response) {
					if (err) {
						console.log("The API returned an error: " + err);
						return;
					}
					console.log(response.data);
				}
			);
		}
	);
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
	console.log(credentials);
	const clientSecret = credentials.web.client_secret;
	const clientId = credentials.web.client_id;
	const redirectUrl = credentials.web.redirect_uris[0];
	const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, function (err, token) {
		if (err) {
			getNewToken(oauth2Client, callback);
		} else {
			oauth2Client.credentials = JSON.parse(token);
			callback(oauth2Client);
		}
	});
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
	const authUrl = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: SCOPES,
	});
	console.log("Authorize this app by visiting this url: ", authUrl);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question("Enter the code from that page here: ", function (code) {
		rl.close();
		oauth2Client.getToken(code, function (err, token) {
			if (err) {
				console.log("Error while trying to retrieve access token", err);
				return;
			}
			oauth2Client.credentials = token;
			storeToken(token);
			callback(oauth2Client);
		});
	});
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
	fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
		if (err) throw err;
		console.log("Token stored to " + TOKEN_PATH);
	});
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getChannel(auth) {
	var service = google.youtube("v3");
	service.channels.list(
		{
			auth: auth,
			part: "snippet,contentDetails,statistics",
			forUsername: "GoogleDevelopers",
		},
		function (err, response) {
			if (err) {
				console.log("The API returned an error: " + err);
				return;
			}
			var channels = response.data.items;
			if (channels.length == 0) {
				console.log("No channel found.");
			} else {
				console.log(
					"This channel's ID is %s. Its title is '%s', and " +
						"it has %s views.",
					channels[0].id,
					channels[0].snippet.title,
					channels[0].statistics.viewCount
				);
			}
		}
	);
}
