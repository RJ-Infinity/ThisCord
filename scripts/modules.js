function getToken(){
	window.ThisCord.updateModules();
	return ThisCord.DiscordModules.find(
		m => m?.exports?.default?.getToken !== void 0
	).exports.default.getToken()
}
exports({getToken})

// Promise