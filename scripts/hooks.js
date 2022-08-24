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
	if (array.indexOf(f) > -1) {
		array.splice(array.indexOf(f), 1);
	}
}
function SettingsOpen(){return ctx.settingsOpen;}
exports({AddSettingsHook,RemoveSettingsHook,SettingsOpen});