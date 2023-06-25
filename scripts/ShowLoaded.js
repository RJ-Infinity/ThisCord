/* @Thiscord-Script
name: "Show Loaded"
author: "RJ_Infinity"
version: "builtin"
description: "Renders a ThisCord logo in the title bar and console logs when it loads"
renderer: true
entryPoint: "main"
*/


console.log("ThisCord: LOADED")
const Graphics = using("Graphics.js");

fetch("http://127.0.0.1:2829/version").then((response) => {
	response.json().then((responseJson) => {
		let currentVersion = responseJson["current"];
		let latestVersion = responseJson["latest"];
		let updateAvailable = latestVersion.version.localeCompare(currentVersion.version, undefined, { numeric: true, sensitivity: 'base' });
		console.log(`latest: ${latestVersion}\ncurrent: ${currentVersion}\nResult: ${updateAvailable}`);
		if (updateAvailable === 1) {
			const msg = new Graphics.MessageBox("New version", `A new version of thiscord is available [${currentVersion.version} >> ${latestVersion.version}]. An update is available via the installer.`);
			msg.show();
		}
	});
});
const modules = using("/modules.js");
var wordmark = "." + modules.getCssName("wordmarkWindows")[0].className.replace(" ", ".");

document.querySelector(wordmark).appendChild((() => {
	var a = document.createElement("span");
	a.innerText = "(ThisCord)";
	// vertical-align: text-top;
	a.style.verticalAlign = "text-top";
	// font-family: var(--font-display);
	a.style.fontFamily = "var(--font-display)";
	// font-size: 0.6em;
	a.style.fontSize = ".7em";
	// font-weight: 700;
	a.style.fontWeight = "700";
	// line-height: 13px;
	a.style.lineHeight = "13px";
	// display: inline-block;
	a.style.display = "inline-block";
	// margin-top: 0.2em;
	a.style.marginTop = "0.2em";
	return a;
})());
document.querySelector(wordmark).style.fontSize = "1em";


exports({main:()=>{console.log("ThisCord: RunningMain")}})