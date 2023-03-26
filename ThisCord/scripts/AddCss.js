ctx.CSSStrings = {}
function addCSS(moduleName, cssName, cssString) {
	if (ctx.CSSStrings[moduleName] === undefined){
		ctx.CSSStrings[moduleName] = {};
	}
	if (ctx.CSSStrings[moduleName][cssName] !== undefined){
		throw `Error: ${cssName} already exists if you want to edit it you have to delete and reinject it`;
	}
	ctx.CSSStrings[moduleName][cssName] = cssString;
}
function deleteCSS(moduleName, cssName) {
	uninjectCSS(moduleName,cssName);
	ctx.CSSStrings[moduleName][cssName] = undefined;
}
function injectCSS(moduleName,cssName) {
	if (ctx.CSSStrings[moduleName] === undefined){
		throw `Error: ${moduleName} is not defined`;
	}
	if (ctx.CSSStrings[moduleName][cssName] === undefined){
		throw `Error: ${moduleName}.${cssName} is not defined`;
	}
	if (document.querySelector(
		`style[ThisCordCSSElementModule=${moduleName}][ThisCordCSSElementName=${cssName}]`
	) !== null) { return; } // already injected
	var MessageEmbedStyle = document.createElement("style");
	MessageEmbedStyle.setAttribute("ThisCordCSSElementModule",moduleName);
	MessageEmbedStyle.setAttribute("ThisCordCSSElementName",cssName);
	MessageEmbedStyle.appendChild(document.createTextNode(ctx.CSSStrings[moduleName][cssName]));
	document.head.appendChild(MessageEmbedStyle);
}
function uninjectCSS(moduleName, cssName) {
	var cssElement = document.querySelector(
		`style[ThisCordCSSElementModule=${moduleName}][ThisCordCSSElementName=${cssName}]`
	);
	if (cssElement === null) { return; }
	cssElement.remove();
}
function uninjectModule(moduleName){
	var cssElement = document.querySelectorAll(
		`style[ThisCordCSSElementModule=${moduleName}]`
	);
	[...cssElement].forEach(el=>el.remove());
}
exports({addCSS,deleteCSS,injectCSS,uninjectCSS,uninjectModule})