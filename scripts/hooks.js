var modules = using("/modules.js");

//setup============================================================================================

ctx.classes = {
	layer:modules.getCssName("layer",["animating"])[0].className,
	baseLayer:modules.getCssName("baseLayer",["animating"])[0].className,
	selected:modules.getCssName("selected",["cozyMessage"])[0].className,
	menu:modules.getCssName("menu",["sparkles"])[0].className,
	layerContainer:modules.getCssName("layerContainer")[0].className,
	notAppAsidePanel:modules.getCssName("notAppAsidePanel")[0].className,
	messageListItem:modules.getCssName("messageListItem")[0].className,
	content:modules.getCssName("content",["downloadProgressCircle"])[0].className,
	chatContent:modules.getCssName("chatContent")[0].className,
	scrollerInner:modules.getCssName("scrollerInner",["navigationDescription"])[0].className,
}

//settingsHook=====================================================================================
ctx.settingsHook = document.querySelector(
	"."+ctx.classes.layer+
	"."+ctx.classes.baseLayer
);
ctx.settingsOpen = ctx.settingsHook.classList.contains("stop-animations");
ctx.settingsHooks = []
new MutationObserver(function (mutationList, observer) {
	mutationList.forEach(function(mutation) {
		if (mutation.type === "attributes" && mutation.attributeName === "class") {
			var oldSettingsOpen = ctx.settingsOpen;
			ctx.settingsOpen = ctx.settingsHook.classList.contains("stop-animations");
			if(!(oldSettingsOpen === ctx.settingsOpen)){
				ctx.settingsHooks.forEach(f=>f());
			}
		}
	});
}).observe(ctx.settingsHook, {attributes: true});
function AddSettingsHook(f){
	if (typeof f!="function"){
		throw "Error f must be a function"
	}
	ctx.settingsHooks.push(f);
}
function RemoveSettingsHook(f){
	if (ctx.settingsHooks.indexOf(f) > -1) {
		ctx.settingsHooks.splice(ctx.settingsHooks.indexOf(f), 1);
	}
}
function SettingsOpen(){return ctx.settingsOpen;}
// document.querySelector(".item-3XjbnG.themed-2-lozF") // server settings
exports({AddSettingsHook,RemoveSettingsHook,SettingsOpen});

//messageMenuHook==================================================================================

const runMessageHook = el=>{
	if (el.id != "message" && el.id != "message-actions"){
		return;
	}
	if (document.querySelectorAll("."+ctx.classes.selected).length > 1){
		console.warn("ThisCord: WARNING: multiple messages selected retrying in 0.25 seconds");
		setTimeout(runMessageHook,250,el);
		return;
	}
	if (document.querySelectorAll("."+ctx.classes.selected).length == 0){
		console.error("ThisCord: ERROR: no selected messages hook not fired");
		return;
	}
	ctx.messageMenuHook.forEach(f=>f(el,document.querySelector("."+ctx.classes.selected)));
}

ctx.messageMenuHook = [];
var messageMenuMutationObserver = new MutationObserver(records=>records.forEach(
	record => Array
	.from(record.addedNodes)
	.forEach(el=>el?.querySelectorAll?.("."+ctx.classes.menu+"[role=menu]")?.forEach?.(runMessageHook))
));
Array
.from(document.querySelectorAll(
	"."+ctx.classes.notAppAsidePanel+
	">."+ctx.classes.layerContainer
))
.forEach(el=>messageMenuMutationObserver.observe(el, {childList: true, subtree: true}));

function AddMessageMenuHook(f){
	if (typeof f!="function"){
		throw "Error f must be a function"
	}
	ctx.messageMenuHook.push(f);
}
function RemoveMessageMenuHook(f){
	if (ctx.messageMenuHook.indexOf(f) > -1) {
		ctx.messageMenuHook.splice(ctx.messageMenuHook.indexOf(f), 1);
	}
}

exports({AddMessageMenuHook,RemoveMessageMenuHook});

//messageLoadedHook=============================================================================
ctx.messageLoadedHooks = [];
new MutationObserver(records=>records.forEach(
	record => Array
	.from(record.addedNodes)
	.filter(el=>el.nodeName == "LI" && el.classList.contains(ctx.classes.messageListItem))
	.forEach(el=>ctx.messageLoadedHooks.forEach(fn => fn(el)))
)).observe(document.querySelector("."+ctx.classes.content), {childList: true, subtree: true});

new MutationObserver(records=>records.forEach(
	record=>Array
	.from(record.addedNodes)
	.filter(el=>el.nodeName == "MAIN" && el.classList.contains(ctx.classes.chatContent))
	.forEach(
		el=>Array
		.from(el.querySelectorAll(
			"ol."+ctx.classes.scrollerInner+
			">li."+ctx.classes.messageListItem
		))
		.forEach(el=>ctx.messageLoadedHooks.forEach(fn => fn(el)))
	)
)).observe(document.querySelector("."+ctx.classes.content), {childList: true, subtree: true});

function AddMessageLoadedHook(f){
	if (typeof f!="function"){
		throw "Error f must be a function";
	}
	ctx.messageLoadedHooks.push(f);
}
function RemoveMessageLoadedHook(f){
	if (ctx.messageLoadedHooks.indexOf(f) > -1) {
		ctx.messageLoadedHooks.splice(ctx.messageLoadedHooks.indexOf(f), 1);
	}
}
function ForEachLoadedMessage(f){
	if (typeof f!="function"){
		throw "Error f must be a function";
	}
	document.querySelectorAll("LI."+ctx.classes.messageListItem).forEach((el)=>f(el));
}
function ForEveryMessage(f){
	ForEachLoadedMessage(f);
	AddMessageLoadedHook(f);
}
exports({AddMessageLoadedHook,RemoveMessageLoadedHook,ForEachLoadedMessage,ForEveryMessage});

