function CheckModules(){
	if (ThisCord.DiscordModules.length < 1){
		window.ThisCord.updateModules();
	}
}

function getToken(){
	CheckModules();
	return ThisCord.DiscordModules.find(
		m => m?.exports?.default?.getToken !== void 0
	).exports.default.getToken()
}

function ToCodePoint(emojiChar,seperator){
	CheckModules();
	return ThisCord.DiscordModules.find(m=>m.id==742358).exports.Z.convert.toCodePoint(emojiChar,seperator);
}
function getEmojiURL(emojiCodePoint){
	CheckModules();
	return ThisCord.DiscordModules.find(m=>m.id==553895).exports("./"+emojiCodePoint+".svg")
}
function testEmoji(e){
	CheckModules();
	return ThisCord.DiscordModules.find(m=>m.id==742358).exports.Z.test(e);
}
exports({getToken,ToCodePoint,getEmojiURL,testEmoji})