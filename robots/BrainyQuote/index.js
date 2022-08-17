const fs = require("fs");

const axios = require("axios");
const cheerio = require("cheerio");

const as = require("wink-nlp/src/as");
const its = require("wink-nlp/src/its.js");

const nlp = require("../winkNLP/index");
const getValuesWithoutHtmlSpacesSpecialChars = require("../winkNLP/utils");

const { getTotalPages } = require("./utils");

const mainUrl = "https://www.brainyquote.com";
const authors = `${mainUrl}/authors`;

const robot = async () => {
	const getDataFavoriteAuthors = async () => {
		let favoriteAuthorsList = [];
		await axios(authors).then((response) => {
			const htmlData = response.data;
			const $ = cheerio.load(htmlData);

			const elementsFavoriteAuthors = $("main .bqLn img.bqPinIcon");
			elementsFavoriteAuthors.each((index, element) => {
				const parent = $(element.parent);

				const authorData = {
					id: index,
					name: parent.find("span.authorContentName").html(),
					href: `${mainUrl}${parent.attr("href")}`,
				};
				favoriteAuthorsList.push(authorData);
			});
		});
		return favoriteAuthorsList;
	};

	const getDataFavoriteAuthorQuotes = async (mainUrl) => {
		let authorData = {
			quotes: [],
		};
		let currentPageIndex = 1;
		let totalPages = 1;

		const fetchData = async (url) => {
			await axios(url).then((response) => {
				const htmlData = response.data;
				const $ = cheerio.load(htmlData);
				totalPages = getTotalPages($);

				const elementAboutAuthor = $("main .subnav-below-p");
				const aboutAuthorText = elementAboutAuthor.html();
				const aboutAuthorObject =
					getValuesWithoutHtmlSpacesSpecialChars(aboutAuthorText);
				const doc = nlp.readDoc(aboutAuthorObject);
				const tokens = doc.tokens().out(its.pos);

				const elementsQuote = $(
					"main #quotesList .qbcol .grid-item a.b-qt div"
				);
				elementsQuote.each((index, element) => {
					authorData.quotes.push({
						id: `${index}_${currentPageIndex}`,
						text: $(element).text().replace(/\n/g, ""),
					});
				});
			});
			if (totalPages > 1) {
				currentPageIndex += 1;
			}
		};
		if (currentPageIndex === 1) await fetchData(mainUrl);
		else {
			let mainHref = mainUrl.slice(0, -2);
			await fetchData(`${mainHref}_${currentPageIndex}`);
		}
		return authorData;
	};

	// Get favorite Authors
	let favoriteAuthorsList = await getDataFavoriteAuthors();
	let authorListToBeSaved = [];
	if (favoriteAuthorsList.length > 0) {
		for (const author of favoriteAuthorsList) {
			const otherData = await getDataFavoriteAuthorQuotes(author.href);
			authorListToBeSaved.push({
				...author,
				...otherData,
			});
		}
	}

	const json = JSON.stringify(authorListToBeSaved);
	if (!fs.existsSync("data")) {
		fs.mkdir("data", { recursive: true }, () => {
			console.log("Folder data does not exist, I'll create one for you!");
		});
	}

	fs.writeFile(
		"data/author-famous-quotes.json",
		json,
		{ encoding: "utf8", flag: "wx" },
		() => {
			console.log("JSON File author-famous-quotes.json, created successfully!");
		}
	);
};

module.exports = robot;
