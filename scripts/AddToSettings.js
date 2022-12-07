var hooks = using("/hooks.js");
var AddCss = using("/AddCss.js");

AddCss.addCSS("Hidden",`.ThisCordSettingsHidden{
	display:none!important;
}`);
AddCss.injectCSS("Hidden");


ctx.pages = {}

function eitherPageClicked(e){
	document.querySelectorAll("[ThisCordSettingsElement]").forEach(el=>el.remove());
	if (ctx.customSelected != undefined && ctx.customSelected != e.target){
		//if we arent clicking ourself and the custom selected exitst
		ctx.customSelected.classList.remove("selected-g-kMVV")
	}
}

function pageClicked(e){
	eitherPageClicked(e);

	var wrapper = document.createElement("div");
	wrapper.classList.add("contentColumn-1C7as6");
	wrapper.classList.add("contentColumnDefault-3eyv5o");
	wrapper.toggleAttribute("ThisCordSettingsElement");
	wrapper.appendChild(ctx.pages[e.target.innerText].content.cloneNode(true));

	var settingsContent = document.querySelector(".contentColumn-1C7as6.contentColumnDefault-3eyv5o:not([ThisCordSettingsElement])")
	settingsContent.parentElement.insertBefore(wrapper, settingsContent);
	settingsContent.classList.add("ThisCordSettingsHidden");

	ctx.previouslySelectedDoc = document.querySelector(".item-3XjbnG.selected-g-kMVV.themed-2-lozF") || ctx.previouslySelectedDoc;
	ctx.previouslySelectedDoc.classList.remove("selected-g-kMVV");
	e.target.classList.add("selected-g-kMVV");
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
		if(document.querySelector(".side-2ur1Qk")==null){
			setTimeout(addToSettings, 250, loops+1);
			//if it fails retry untill it works
			return;
		}

		ctx.previouslySelectedDoc = null;
		ctx.customSelected = null;

		Array.from(document.querySelector(".side-2ur1Qk").children).forEach(element => {
			if (element.innerText == "What's New"){
				nextSettingsPageEl = element
			}
		});

		document.querySelectorAll(".item-3XjbnG").forEach(el=>el.addEventListener("click",defaultPageClicked));

		seperator = document.createElement("DIV");
		seperator.classList.add("separator-2wx7h6");
		document.querySelector(".side-2ur1Qk").insertBefore(seperator, nextSettingsPageEl.previousSibling);
		
		header = document.createElement("DIV");
		header.classList.add("header-2Kx1US");
		header.classList.add("eyebrow-Ejf06y");
		header.innerText = "ThisCord";
		document.querySelector(".side-2ur1Qk").insertBefore(header, nextSettingsPageEl.previousSibling);

		Object.keys(ctx.pages).forEach(key=>{
			pageLink = document.createElement("DIV");
			pageLink.classList.add("item-3XjbnG");
			pageLink.classList.add("themed-2-lozF");
			pageLink.innerText = key;
			pageLink.addEventListener("click",pageClicked);
			document.querySelector(".side-2ur1Qk").insertBefore(pageLink, nextSettingsPageEl.previousSibling);
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
