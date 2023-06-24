var modules = using("/modules.js");

//setup============================================================================================

var classes = {
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
var settingsHook = document.querySelector(
	"."+classes.layer+
	"."+classes.baseLayer
);
var settingsOpen = settingsHook.classList.contains("stop-animations");
var settingsHooks = []
new MutationObserver(function (mutationList, observer) {
	mutationList.forEach(function(mutation) {
		if (mutation.type === "attributes" && mutation.attributeName === "class") {
			var oldSettingsOpen = settingsOpen;
			settingsOpen = settingsHook.classList.contains("stop-animations");
			if(!(oldSettingsOpen === settingsOpen)){
				settingsHooks.forEach(f=>f());
			}
		}
	});
}).observe(settingsHook, {attributes: true});
function AddSettingsHook(f){
	if (typeof f!="function"){
		throw "Error f must be a function"
	}
	settingsHooks.push(f);
}
function RemoveSettingsHook(f){
	if (settingsHooks.indexOf(f) > -1) {
		settingsHooks.splice(settingsHooks.indexOf(f), 1);
	}
}
function SettingsOpen(){return settingsOpen;}
// document.querySelector(".item-3XjbnG.themed-2-lozF") // server settings
exports({AddSettingsHook,RemoveSettingsHook,SettingsOpen});

//messageMenuHook==================================================================================

const runMessageHook = el=>{
	if (el.id != "message" && el.id != "message-actions"){
		return;
	}
	if (document.querySelectorAll("."+classes.selected).length > 1){
		console.warn("ThisCord: WARNING: multiple messages selected retrying in 0.25 seconds");
		setTimeout(runMessageHook,250,el);
		return;
	}
	if (document.querySelectorAll("."+classes.selected).length == 0){
		console.error("ThisCord: ERROR: no selected messages hook not fired");
		return;
	}
	messageMenuHook.forEach(f=>f(el,document.querySelector("."+classes.selected)));
}

var messageMenuHook = [];
var messageMenuMutationObserver = new MutationObserver(records=>records.forEach(
	record => Array
	.from(record.addedNodes)
	.forEach(el=>el?.querySelectorAll?.("."+classes.menu+"[role=menu]")?.forEach?.(runMessageHook))
));
Array
.from(document.querySelectorAll(
	"."+classes.notAppAsidePanel+
	">."+classes.layerContainer
))
.forEach(el=>messageMenuMutationObserver.observe(el, {childList: true, subtree: true}));

function AddMessageMenuHook(f){
	if (typeof f!="function"){
		throw "Error f must be a function"
	}
	messageMenuHook.push(f);
}
function RemoveMessageMenuHook(f){
	if (messageMenuHook.indexOf(f) > -1) {
		messageMenuHook.splice(messageMenuHook.indexOf(f), 1);
	}
}

exports({AddMessageMenuHook,RemoveMessageMenuHook});

//messageLoadedHook=============================================================================
var messageLoadedHooks = [];
new MutationObserver(records=>records.forEach(
	record => Array
	.from(record.addedNodes)
	.filter(el=>el.nodeName == "LI" && el.classList.contains(classes.messageListItem))
	.forEach(el=>messageLoadedHooks.forEach(fn => fn(el)))
)).observe(document.querySelector("."+classes.content), {childList: true, subtree: true});

new MutationObserver(records=>records.forEach(
	record=>Array
	.from(record.addedNodes)
	.filter(el=>el.nodeName == "MAIN" && el.classList.contains(classes.chatContent))
	.forEach(
		el=>Array
		.from(el.querySelectorAll(
			"ol."+classes.scrollerInner+
			">li."+classes.messageListItem
		))
		.forEach(el=>messageLoadedHooks.forEach(fn => fn(el)))
	)
)).observe(document.querySelector("."+classes.content), {childList: true, subtree: true});

function AddMessageLoadedHook(f){
	if (typeof f!="function"){
		throw "Error f must be a function";
	}
	messageLoadedHooks.push(f);
}
function RemoveMessageLoadedHook(f){
	if (messageLoadedHooks.indexOf(f) > -1) {
		messageLoadedHooks.splice(messageLoadedHooks.indexOf(f), 1);
	}
}
function ForEachLoadedMessage(f){
	if (typeof f!="function"){
		throw "Error f must be a function";
	}
	document.querySelectorAll("LI."+classes.messageListItem).forEach((el)=>f(el));
}
function ForEveryMessage(f){
	ForEachLoadedMessage(f);
	AddMessageLoadedHook(f);
}
exports({AddMessageLoadedHook,RemoveMessageLoadedHook,ForEachLoadedMessage,ForEveryMessage});

