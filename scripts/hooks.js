
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
exports({AddSettingsHook,RemoveSettingsHook,SettingsOpen});

//messageMenuHook==================================================================================

//".selected-2LX7Jy"get selected message query selector
// document.querySelectorAll(".appDevToolsWrapper-1QxdQf>div>.layerContainer-2v_Sit")

//messageLoadedHook=============================================================================
ctx.messageLoadedHooks = [];
new MutationObserver(records=>records.forEach(
	record => Array
	.from(record.addedNodes)
	.filter(el=>el.nodeName == "LI" && el.classList.contains("messageListItem-ZZ7v6g"))
	.forEach(el=>ctx.messageLoadedHooks.forEach(fn => fn(el)))
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
	document.querySelectorAll("LI.messageListItem-ZZ7v6g").forEach((el)=>f(el))
}
function ForEveryMessage(f){
	ForEachLoadedMessage(f);
	AddMessageLoadedHook(f);
}
exports({AddMessageLoadedHook,RemoveMessageLoadedHook,ForEachLoadedMessage,ForEveryMessage});

