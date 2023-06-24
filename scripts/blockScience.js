/* @Thiscord-Script
name: "test script"
fileName: "blockSentry.js"
author: "titushm"
authorID: 123123123123123123
version: "1.0.0"
description: "this is very good script yes"
updateURL: "https://update.me/script.js"
*/

// initiateScript.init({
// name: "test script",
// fileName: "blockSentry.js",
// author: "titushm",
// authorID: 123123123123123123,
// version: "1.0.0",
// description: "this is very good script yes",
// updateURL: "https://update.me/script.js",
// })
console.log("blockScience LOADED!");
const internalXMLHttpRequestOpen = window.XMLHttpRequest.prototype.send;
const sentryRegex = /https:\/\/discord\.com\/api\/v\d+\/science/;

window.XMLHttpRequest.prototype.send = function (body) {
	var url = this.__sentry_xhr_v2__.url;
	if (url.match(sentryRegex)) {
		return;
	};
	return internalXMLHttpRequestOpen.apply(this, arguments);
};