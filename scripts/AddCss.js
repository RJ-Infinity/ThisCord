ctx.CSSStrings = {}
function addCSS(cssName, cssString) {
	if (ctx.CSSStrings[cssName] !== undefined){
		throw `Error: ${cssName} already exists if you want to edit it you have to delete and reinject it`;
	}
	ctx.CSSStrings[cssName] = cssString;
}
function deleteCSS(cssName) {
	uninjectCSS(cssName);
	ctx.CSSStrings[cssName] = undefined;
}
function injectCSS(cssName) {
	if (ctx.CSSStrings[cssName] === undefined){
		throw `Error: ${cssName} is not defined`;
	}
	if (document.getElementById("ThisCordCSSElement_"+cssName) !== null) { return; } // already injected
	var MessageEmbedStyle = document.createElement("style");
	MessageEmbedStyle.id = `ThisCordCSSElement_${cssName}`;
	MessageEmbedStyle.innerText = ctx.CSSStrings[cssName];
	document.head.appendChild(MessageEmbedStyle);
}
function uninjectCSS(cssName) {
	var cssElement = document.getElementById("ThisCordCSSElement_"+cssName);
	if (cssElement === null) { return; }
	cssElement.remove();
}
exports({addCSS,deleteCSS,injectCSS,uninjectCSS})