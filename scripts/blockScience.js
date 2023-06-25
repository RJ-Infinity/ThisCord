/* @Thiscord-Script
name: "Block Science"
author: "titushm"
version: "builtin"
description: "blocks discords science url which is how they harvest data from you"
renderer: true
*/

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