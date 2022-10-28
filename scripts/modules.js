function CheckModules(force=false){
	if (force || ThisCord.DiscordModules.length < 1){
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
	CheckModules(true);//seems to load later
	return ThisCord.DiscordModules.find(m=>(
		m?.exports !== void 0 &&
		typeof m.exports == "function" &&
		m.exports?.resolve !== void 0 &&
		typeof m.exports.resolve == "function" &&
		m.exports?.keys !== void 0 &&
		typeof m.exports.keys == "function" &&
		m.id==553895
	)).exports("./"+emojiCodePoint+".svg")
}
function testEmoji(e){
	CheckModules();
	return ThisCord.DiscordModules.find(m=>m.id==742358).exports.Z.test(e);
}
exports({getToken,ToCodePoint,getEmojiURL,testEmoji})