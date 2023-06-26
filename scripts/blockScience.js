/* @Thiscord-Script
name: "Block Science"
author: "titushm"
version: "builtin"
description: "blocks discords science url, used for telemetry data"
renderer: true
entryPoint: "main"
*/

console.log("blockScience LOADED!");
const Requests = using("Requests.js");
const urlRegex = /https:\/\/discord\.com\/api\/v\d+\/science/;


Requests.onRequest((request) => {
	if (request.url.match(urlRegex)) {
		request.cancel = true;
	};
});