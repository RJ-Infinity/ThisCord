/* @Thiscord-Script
name: "Add To Settings"
author: ["RJ_Infinity", "titushm"]
version: "builtin"
description: "Adds pages to the discord settings page"
renderer: true
*/

var hooks = using("/hooks.js");
var Css = using("/Css.js");
var modules = using("/modules.js");

const CssModule = new Css();

const hidden = CssModule.createCss(
	"Hidden",
	`.ThisCordSettingsHidden{
	display:none!important;
}`
);
hidden.inject();

var pages = {};
var pageElements = {};
var customSelected = undefined;
var classes = {
	selected: modules.getCssName("selected", ["topPill"])[0].className,
	contentColumn: modules.getCssName("contentColumn")[0].className,
	contentColumnDefault: modules.getCssName("contentColumnDefault")[0].className,
	item: modules.getCssName("item", ["topPill"])[0].className,
	themed: modules.getCssName("themed", ["topPill"])[0].className,
	side: modules.getCssName("side", ["topPill"])[0].className,
	separator: modules.getCssName("separator", ["topPill"])[0].className,
	header: modules.getCssName("header", ["topPill"])[0].className,
	eyebrow: modules.getCssName("eyebrow"),
};
//this is beacuse the one we want always has the least other classes but there are many that have the same name that we cant determine which one it is
classes.eyebrow = classes.eyebrow.map((classObj) => {
	classObj.len = Object.keys(classObj.otherClasses).length;
	return classObj;
});
classes.eyebrow = classes.eyebrow.reduce(
	//this might not always work but it is better than the having to fix it every update
	(smallestClass, classObj) => (smallestClass.len < classObj.len ? smallestClass : classObj),
	classes.eyebrow[0]
).className;

function eitherPageClicked(e) {
	document.querySelectorAll("[ThisCordSettingsElement]").forEach((el) => el.parentElement.removeChild(el));
	if (customSelected != undefined && customSelected != e.target) {
		//if we arent clicking ourself and the custom selected exitst
		customSelected.classList.remove(classes.selected);
	}
}

function getPage(title) {
	if (Object.keys(pageElements).includes(title)) {
		return pageElements[title];
	}
	var page = document.createElement("div");
	page.classList.add(classes.contentColumn);
	page.classList.add(classes.contentColumnDefault);
	page.toggleAttribute("ThisCordSettingsElement");
	page.appendChild(pages[title]);
	pageElements[title] = page;
	return page;
}

function pageClicked(e) {
	eitherPageClicked(e);

	var wrapper = getPage(e.target.innerText);

	var settingsContent = document.querySelector("." + classes.contentColumn + "." + classes.contentColumnDefault + ":not([ThisCordSettingsElement])");
	settingsContent.parentElement.insertBefore(wrapper, settingsContent);
	settingsContent.classList.add("ThisCordSettingsHidden");

	previouslySelectedDoc = document.querySelector("." + classes.selected + "." + classes.item + "." + classes.themed) || previouslySelectedDoc;
	previouslySelectedDoc.classList.remove(classes.selected);
	e.target.classList.add(classes.selected);
	customSelected = e.target;
}
function defaultPageClicked(e) {
	if (
		//if the button dosent change the page dont remove the content
		e.target.innerText == modules.getTextMap().WHATS_NEW ||
		e.target.getAttribute("aria-label") == modules.getTextMap().LOGOUT ||
		e.target.innerText == modules.getTextMap().LOGOUT ||
		e.target.parentElement.innerText == modules.getTextMap().LOGOUT
	) {
		return;
	}
	document.querySelectorAll(".ThisCordSettingsHidden").forEach((el) => el.classList.remove("ThisCordSettingsHidden"));
	eitherPageClicked(e);
}
function addToSettings(loops = 0) {
	if (hooks.SettingsOpen()) {
		if (loops > 20) {
			return;
		} //if it fails over 20 times give up
		if (document.querySelector("." + classes.side) == null) {
			setTimeout(addToSettings, 250, loops + 1);
			//if it fails retry untill it works
			return;
		}

		previouslySelectedDoc = null;
		customSelected = null;

		var nextSettingsPageEl;
		Array.from(document.querySelector("." + classes.side).children).forEach((element) => {
			if (element.innerText == modules.getTextMap().WHATS_NEW) {
				nextSettingsPageEl = element;
			}
		});

		document.querySelectorAll("." + classes.item).forEach((el) => el.addEventListener("click", defaultPageClicked));

		var seperator = document.createElement("DIV");
		seperator.classList.add(classes.separator);
		document.querySelector("." + classes.side).insertBefore(seperator, nextSettingsPageEl.previousSibling);

		var header = document.createElement("DIV");
		header.classList.add(classes.header);
		header.classList.add(classes.eyebrow);
		header.innerText = "ThisCord";
		document.querySelector("." + classes.side).insertBefore(header, nextSettingsPageEl.previousSibling);

		Object.keys(pages).forEach((key) => {
			var pageLink = document.createElement("DIV");
			pageLink.classList.add(classes.item);
			pageLink.classList.add(classes.themed);
			pageLink.innerText = key;
			pageLink.addEventListener("click", pageClicked);
			document.querySelector("." + classes.side).insertBefore(pageLink, nextSettingsPageEl.previousSibling);
		});
	}
}

function addPage(name, element) {
	if (!(element instanceof Element || element instanceof DocumentFragment)) {
		throw "Error: content must be a element";
	}
	pages[name] = element;
}
function removePage(name) {
	delete pages[name];
}
hooks.AddSettingsHook(addToSettings);

exports({ addPage, removePage });
