var hooks = using("/hooks.js")

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
	ctx.previouslySelectedDoc = document.querySelector(".item-3XjbnG.selected-g-kMVV.themed-2-lozF");
	ctx.previouslySelectedDoc.classList.remove("selected-g-kMVV");
	e.target.classList.add("selected-g-kMVV");
	ctx.customSelected = e.target;
	var content = document.querySelector(".contentRegionScroller-2_GT_N.contentRegionShownSidebar-fHXkEg.auto-2K3UW5.scrollerBase-_bVAAt>.contentColumn-1C7as6.contentColumnDefault-3eyv5o");
	Array.from(content.children).forEach(el=>{
		el.setAttribute("ThisCordSettingsOldStyle",el.getAttribute("style")||"");
		el.style = "display:none;";
	});
	var wrapper = document.createElement("div");
	wrapper.toggleAttribute("ThisCordSettingsElement");
	wrapper.appendChild(ctx.pages[e.target.innerText].content.cloneNode(true));
	content.appendChild(wrapper);
}
function defaultPageClicked(e){
	console.log(e.target)
	console.log(e.target.innerText)
	if (//if the button dosent change the page dont remove the content
		e.target.innerText == "What's New" ||
		e.target.getAttribute("aria-label")=="Log Out"||
		e.target.innerText == "Log Out" ||
		e.target.parentElement.innerText == "Log Out"
	){return;}
	eitherPageClicked(e);
	if (e.target == ctx.previouslySelectedDoc){
		ctx.previouslySelectedDoc.classList.add("selected-g-kMVV");
		document.querySelectorAll("[ThisCordSettingsOldStyle]").forEach(el=>el.setAttribute("style",el.getAttribute("ThisCordSettingsOldStyle")))
	}
}

function addToSettings(loops = 0){
	if (hooks.SettingsOpen()){
		if(loops > 20){return;}//if it fails over 20 times give up
		if(document.querySelector(".side-2ur1Qk")==null){
			setTimeout(addToSettings, 250, loops+1);
			//if it fails retry untill it works
			return;
		}
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
