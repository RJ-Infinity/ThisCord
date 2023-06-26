/* @Thiscord-Script
name: "Anti content block"
author: "titushm"
version: "builtin"
description: "Allows copyrighted youtube videos to play directly in the embed"
backend: true
entryPoint: "main"
*/

console.log("antiContentBlock LOADED!");
const Requests = using("Requests.js");

Requests.onRequest((request) => {
	if (request.url.startsWith("https://www.youtube.com/embed/")) {
		request.headers["Referer"] = "https://youtube.com";
	}
});