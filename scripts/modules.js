function CheckModules(force=false){
	if (force || ThisCord.DiscordModules.length < 1){
		window.ThisCord.updateModules();
	}
}

ModuleIDs = {
	Emoji: [
		m=>m.id==742358,
		m=>m?.exports?.Z?.className==="emoji",
		m=>m?.exports?.Z?.base==="https://twemoji.maxcdn.com/v/14.0.2/"
	],
	EmojiMap: [
		m=>m.id==553895,
		m=>m?.exports !== void 0 &&
		typeof m.exports == "function" &&
		m.exports?.resolve !== void 0 &&
		typeof m.exports.resolve == "function" &&
		m.exports?.keys !== void 0 &&
		typeof m.exports.keys == "function" &&
		[
			"./1f004.svg",
			"./1f0cf.svg",
			"./1f170.svg",
			"./1f171.svg",
			"./1f17e.svg",
			"./1f17f.svg",
			"./1f18e.svg",
			"./1f191.svg",
			"./1f192.svg",
			"./1f193.svg",
			"./1f194.svg",
			"./1f195.svg",
			"./1f196.svg"
		].reduce((acc, cur) => acc && m.exports.keys().includes(cur),true)
	],
	humanize:[
		m=>m.id==206982,
		m=>m?.exports !== void 0 &&
		typeof m.exports == "function" &&
		m.exports?.humanize !== void 0 &&
		typeof m.exports.humanize == "function"
	],
	details:[
		m => m?.exports?.default?.getToken !== void 0,
		m => m?.exports?.default?.getEmail !== void 0
	],
	inviter:[
		m => m?.exports?.Z?.createFriendInvite
	],
	AudioMap: [
		m=>m.id==614443,
		m=>m?.exports !== void 0 &&
		typeof m.exports == "function" &&
		m.exports?.resolve !== void 0 &&
		typeof m.exports.resolve == "function" &&
		m.exports?.keys !== void 0 &&
		typeof m.exports.keys == "function" &&
		[
			"./call_calling.mp3",
			"./call_ringing.mp3",
			"./call_ringing_beat.mp3",
			"./call_ringing_halloween.mp3",
			"./chaos_bootup.mp3",
			"./chaos_call_calling.mp3",
			"./chaos_call_ringing.mp3",
			"./chaos_deafen.mp3",
			"./chaos_disconnect.mp3",
			"./chaos_message.mp3",
			"./chaos_mute.mp3",
			"./chaos_ptt_start.mp3",
			"./chaos_ptt_stop.mp3"
		].reduce((acc, cur) => acc && m.exports.keys().includes(cur),true)
	],
}

function getModule(moduleID){
	for (let i = 0; i < moduleID.length; i++) {
		var module = ThisCord.DiscordModules.find(moduleID[i]);
		if (module !== undefined){
			return module;
		}
	}
	throw "Error module not found"
}

// ======
// functionality
// ======

function getToken(){
	CheckModules();
	return getModule(ModuleIDs.details).exports.default.getToken();
}
function getEmail(){
	CheckModules();
	return getModule(ModuleIDs.details).exports.default.getEmail();
}

function ToCodePoint(emojiChar,seperator){
	CheckModules();
	return getModule(ModuleIDs.Emoji).exports.Z.convert.toCodePoint(emojiChar,seperator);
}
function getEmojiURL(emojiCodePoint){
	CheckModules(true);//seems to load later
	return getModule(ModuleIDs.EmojiMap).exports("./"+emojiCodePoint+".svg")
}

function testEmoji(e){
	CheckModules();
	return getModule(ModuleIDs.Emoji).exports.Z.test(e);
}

function audioMap(){
	CheckModules(true);
	return getModule(ModuleIDs.AudioMap).exports;
}

function getCssName(sel,identifyingClasses=[],count){
	CheckModules();
	return ThisCord.DiscordModules.filter(
		m=>typeof m.exports === "object" &&
		Object.keys(m.exports).includes(sel) &&
		identifyingClasses.reduce(
			(acc, cur) => acc &&
			Object.keys(m.exports).includes(cur),
			true
		) && (
			count === undefined ||
			Object.keys(m.exports).length === count
		)
	).map(m=>({className:m.exports[sel],otherClasses:m.exports}));
}

exports({getToken,ToCodePoint,getEmojiURL,testEmoji,audioMap,getCssName,getModule})
// https://github.com/doggybootsy/discord-hacksget
