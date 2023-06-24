// ctx.CSSStrings = {};
// function addCSS (moduleName, cssName, cssString) {
// 	if (ctx.CSSStrings[moduleName] === undefined) {
// 		ctx.CSSStrings[moduleName] = {};
// 	}
// 	if (ctx.CSSStrings[moduleName][cssName] !== undefined) {
// 		throw `Error: ${moduleName}.${cssName} already exists if you want to edit it you have to delete and reinject it`;
// 	}
// 	ctx.CSSStrings[moduleName][cssName] = cssString;
// }
// function deleteCSS (moduleName, cssName) {
// 	uninjectCSS(moduleName, cssName);
// 	ctx.CSSStrings[moduleName][cssName] = undefined;
// }
// function injectCSS (moduleName, cssName) {
// 	if (ctx.CSSStrings[moduleName] === undefined) {
// 		throw `Error: ${moduleName} is not defined`;
// 	}
// 	if (ctx.CSSStrings[moduleName][cssName] === undefined) {
// 		throw `Error: ${moduleName}.${cssName} is not defined`;
// 	}
// 	if (document.querySelector(
// 		`style[ThisCordCSSElementModule=${moduleName}][ThisCordCSSElementName=${cssName}]`
// 	) !== null) { return; } // already injected
// 	var MessageEmbedStyle = document.createElement("style");
// 	MessageEmbedStyle.setAttribute("ThisCordCSSElementModule", moduleName);
// 	MessageEmbedStyle.setAttribute("ThisCordCSSElementName", cssName);
// 	MessageEmbedStyle.appendChild(document.createTextNode(ctx.CSSStrings[moduleName][cssName]));
// 	document.head.appendChild(MessageEmbedStyle);
// }
// function uninjectCSS (moduleName, cssName) {
// 	var cssElement = document.querySelector(
// 		`style[ThisCordCSSElementModule=${moduleName}][ThisCordCSSElementName=${cssName}]`
// 	);
// 	if (cssElement === null) { return; }
// 	cssElement.remove();
// }
// function uninjectModule (moduleName) {
// 	var cssElement = document.querySelectorAll(
// 		`style[ThisCordCSSElementModule=${moduleName}]`
// 	);
// 	[...cssElement].forEach(el => el.remove());
// }

function generateUUID () {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0,
			v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}
class Css {
	constructor(cssModule, cssName, cssString) {
		this.cssModule = cssModule;
		this.moduleName = cssModule.name;
		this.cssName = cssName;
		this.cssString = cssString;
	}
	inject () {
		if (document.querySelector(
			`style[ThisCordCSSElementModule=${this.moduleName}][ThisCordCSSElementName=${this.cssName}]`
		) !== null) { return; } // already injected
		var MessageEmbedStyle = document.createElement("style");
		MessageEmbedStyle.setAttribute("ThisCordCSSElementModule", this.moduleName);
		MessageEmbedStyle.setAttribute("ThisCordCSSElementName", this.cssName);
		MessageEmbedStyle.appendChild(document.createTextNode(this.cssString));
		document.head.appendChild(MessageEmbedStyle);
	}

	eject () {
		var cssElement = document.querySelector(
			`style[ThisCordCSSElementModule=${this.moduleName}][ThisCordCSSElementName=${this.cssName}]`
		);
		if (cssElement === null) { return; }
		cssElement.remove();
	}

	delete () {
		this.eject();
		cssModule._removeCssFromList(this.cssName);
	}
}

class CssModule {
	constructor() {
		this.moduleName = generateUUID();
		this.cssList = [];
		this.injected = true;
	}

	createCss (cssName, CssString) {
		if (this.cssList.includes(cssName)) {
			throw "CssName already exists on module, use a unique CssName";
		}
		if (!this.injected) {
			throw "Reinject the module first before creating more css";
		}
		let css = new Css(this.moduleName, cssName, CssString);
		this.cssList.push(css);
		return css;
	}

	eject () {
		this.injected = false;
		this.cssList.forEach(css => {
			css.eject();
		});
	}

	reInject () {
		this.injected = true;
		this.cssList.forEach(css => {
			css.inject();
		});
	}

	_removeCssFromList (cssName) {
		this.cssList.splice(this.cssList.indexOf(cssName), 1);
	}
}

exportSingle(CssModule);