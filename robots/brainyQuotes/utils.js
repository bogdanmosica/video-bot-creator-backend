/**
 *
 * @param {Object} $ cheerio object
 * @returns the number of pages found on a page from https://www.brainyquote.com/
 */
const getTotalPages = ($) => {
	return $("ul.pagination li.page-item").length - 2;
};

module.exports = { getTotalPages };
