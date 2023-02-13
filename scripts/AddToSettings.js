var hooks = using("/hooks.js");
var AddCss = using("/AddCss.js");
var modules = using("/modules.js");

AddCss.addCSS("Hidden",`.ThisCordSettingsHidden{
	display:none!important;
}`);
AddCss.injectCSS("Hidden");


ctx.pages = {}

ctx.classes = {
	selected:modules.getCssName("selected",["topPill"])[0].className,
	contentColumn:modules.getCssName("contentColumn")[0].className,
	contentColumnDefault:modules.getCssName("contentColumnDefault")[0].className,
	item:modules.getCssName("item",["topPill"])[0].className,
	themed:modules.getCssName("themed",["topPill"])[0].className,
	side:modules.getCssName("side",["topPill"])[0].className,
	separator:modules.getCssName("separator",["topPill"])[0].className,
	header:modules.getCssName("header",["topPill"])[0].className,
	eyebrow:modules.getCssName("eyebrow",[],55)[0].className,
}

function eitherPageClicked(e){
	document.querySelectorAll("[ThisCordSettingsElement]").forEach(el=>el.remove());
	if (ctx.customSelected != undefined && ctx.customSelected != e.target){
		//if we arent clicking ourself and the custom selected exitst
		ctx.customSelected.classList.remove(ctx.classes.selected)
	}
}

function pageClicked(e){
	eitherPageClicked(e);

	var wrapper = document.createElement("div");
	wrapper.classList.add(ctx.classes.contentColumn);
	wrapper.classList.add(ctx.classes.contentColumnDefault);
	wrapper.toggleAttribute("ThisCordSettingsElement");
	wrapper.appendChild(ctx.pages[e.target.innerText].content.cloneNode(true));

	var settingsContent = document.querySelector(
		"."+ctx.classes.contentColumn+
		"."+ctx.classes.contentColumnDefault+
		":not([ThisCordSettingsElement])"
	)
	settingsContent.parentElement.insertBefore(wrapper, settingsContent);
	settingsContent.classList.add("ThisCordSettingsHidden");

	ctx.previouslySelectedDoc = document.querySelector(
		"."+ctx.classes.selected+
		"."+ctx.classes.item+
		"."+ctx.classes.themed
	) || ctx.previouslySelectedDoc;
	ctx.previouslySelectedDoc.classList.remove(ctx.classes.selected);
	e.target.classList.add(ctx.classes.selected);
	ctx.customSelected = e.target;
}
function defaultPageClicked(e){
	if (//if the button dosent change the page dont remove the content
	e.target.innerText == "What's New" ||
	e.target.getAttribute("aria-label")=="Log Out"||
		e.target.innerText == "Log Out" ||
		e.target.parentElement.innerText == "Log Out"
	){return;}
	document.querySelectorAll(".ThisCordSettingsHidden").forEach(el=>el.classList.remove("ThisCordSettingsHidden"));
	eitherPageClicked(e);
}
function addToSettings(loops = 0){
	if (hooks.SettingsOpen()){
		if(loops > 20){return;}//if it fails over 20 times give up
		if(document.querySelector("."+ctx.classes.side)==null){
			setTimeout(addToSettings, 250, loops+1);
			//if it fails retry untill it works
			return;
		}

		ctx.previouslySelectedDoc = null;
		ctx.customSelected = null;

		Array.from(document.querySelector("."+ctx.classes.side).children).forEach(element => {
			if (element.innerText == "What's New"){
				nextSettingsPageEl = element
			}
		});

		document.querySelectorAll("."+ctx.classes.item).forEach(el=>el.addEventListener("click",defaultPageClicked));

		seperator = document.createElement("DIV");
		seperator.classList.add(ctx.classes.separator);
		document.querySelector("."+ctx.classes.side).insertBefore(seperator, nextSettingsPageEl.previousSibling);
		
		header = document.createElement("DIV");
		header.classList.add(ctx.classes.header);
		header.classList.add(ctx.classes.eyebrow);
		header.innerText = "ThisCord";
		document.querySelector("."+ctx.classes.side).insertBefore(header, nextSettingsPageEl.previousSibling);

		Object.keys(ctx.pages).forEach(key=>{
			pageLink = document.createElement("DIV");
			pageLink.classList.add(ctx.classes.item);
			pageLink.classList.add(ctx.classes.themed);
			pageLink.innerText = key;
			pageLink.addEventListener("click",pageClicked);
			document.querySelector("."+ctx.classes.side).insertBefore(pageLink, nextSettingsPageEl.previousSibling);
		});
	}
}

function addPage(name,template){
	if (template.constructor.name != "HTMLTemplateElement" || template.nodeName != "TEMPLATE"){
		throw "Error: content must be a template"
	}
	ctx.pages[name] = template;
}
function removePage(name){delete ctx.pages[name];}
hooks.AddSettingsHook(addToSettings);

exports({addPage,removePage});
