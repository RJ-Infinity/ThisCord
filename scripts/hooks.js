
//settingsHook=====================================================================================
ctx.settingsHook = document.querySelector(".layer-86YKbF.baseLayer-W6S8cY");
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
	if (document.querySelectorAll(".selected-2LX7Jy").length > 1){
		console.warn("WARNING: multiple messages selected retrying in 0.25 seconds");
		setTimeout(runMessageHook,250,el);
		return;
	}
	if (document.querySelectorAll(".selected-2LX7Jy").length == 0){
		console.error("ERROR: no selected messages hook not fired");
		return;
	}
	ctx.messageMenuHook.forEach(f=>f(el,document.querySelector(".selected-2LX7Jy")));
}

ctx.messageMenuHook = [];
var messageMenuMutationObserver = new MutationObserver(records=>records.forEach(
	record => Array
	.from(record.addedNodes)
	.forEach(el=>el.querySelectorAll(".menu-1QACrS[role=menu]").forEach(runMessageHook))
));
Array
.from(document.querySelectorAll(".appDevToolsWrapper-1QxdQf>div>.layerContainer-2v_Sit"))
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
	.filter(el=>el.nodeName == "LI" && el.classList.contains("messageListItem-ZZ7v6g"))
	.forEach(el=>ctx.messageLoadedHooks.forEach(fn => fn(el)))
)).observe(document.querySelector(".content-1SgpWY"), {childList: true, subtree: true});

new MutationObserver(records=>records.forEach(
	record=>Array
	.from(record.addedNodes)
	.filter(el=>el.nodeName == "MAIN" && el.classList.contains("chatContent-3KubbW"))
	.forEach(
		el=>Array
		.from(el.querySelectorAll("ol.scrollerInner-2PPAp2>li.messageListItem-ZZ7v6g"))
		.forEach(el=>ctx.messageLoadedHooks.forEach(fn => fn(el)))
	)
)).observe(document.querySelector(".content-1SgpWY"), {childList: true, subtree: true});

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
	document.querySelectorAll("LI.messageListItem-ZZ7v6g").forEach((el)=>f(el));
}
function ForEveryMessage(f){
	ForEachLoadedMessage(f);
	AddMessageLoadedHook(f);
}
exports({AddMessageLoadedHook,RemoveMessageLoadedHook,ForEachLoadedMessage,ForEveryMessage});

