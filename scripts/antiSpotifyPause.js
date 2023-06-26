/* @Thiscord-Script
name: "Anti Spotify Pause"
author: "titushm"
version: "builtin"
description: "Bypasses the 30s limit of talking in a voice chat and listening to spotify"
renderer: true
entryPoint: "main"
*/

console.log("antiSpotifyPause LOADED!");
const Requests = using("Requests.js");
const modules = using("modules.js");
const urlRegex = /https:\/\/api\.spotify\.com\/v\d+\/me\/player\/pause/;

Requests.onRequest((request) => {
	if (request.url.match(urlRegex)) {
		request.cancel = true;
		let alertClass = modules.getCssName("base").filter(element => Object.keys(element.otherClasses).includes("container"))[0].className;
		let alertObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.addedNodes.length > 0) {
					const pausedAlert = [...mutation.addedNodes[0].childNodes].find(element => element.data === "Spotify playback paused while transmitting audio.");
					if (pausedAlert) {
						mutation.addedNodes[0].remove();
						alertObserver.disconnect();
					}
				}
			});
		});
		alertObserver.observe(document.querySelector(`.${alertClass}`), { childList: true });
		setTimeout(() => { alertObserver.disconnect(); }, 10000);
		return;
	};
});