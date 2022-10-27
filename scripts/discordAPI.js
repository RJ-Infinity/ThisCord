var modules = using("/modules.js");

ctx.MessageCache = {};
ctx.GuildCache = {};
ctx.ChannelCache = {};
ctx.ProfileCache = {};

function getMessage(channelID, messageID){
	if (
		ctx.MessageCache[channelID] != undefined &&
		ctx.MessageCache[channelID][messageID] != undefined
	){
		return ctx.MessageCache[channelID][messageID];
	}
	if (ctx.MessageCache[channelID] == undefined){
		ctx.MessageCache[channelID] = {};
	}
	ctx.MessageCache[channelID][messageID] = fetch(
		`https://discordapp.com/api/v6/channels/${channelID}/messages?limit=1&around=${messageID}`,
		{headers: {
			"Content-Type": "application/json",
			"Authorization": modules.getToken()
		}}
	)
	.then(response=>!response.ok?{json:()=>[]}:response)
	.then(response => response.json())
	.then(json=>json.length == 0?null:json[0]);
	return ctx.MessageCache[channelID][messageID]
}
function getGuild(guildID){
	if (ctx.GuildCache[guildID] != undefined){
		return ctx.GuildCache[guildID];
	}
	ctx.GuildCache[guildID] = fetch(
		`https://discordapp.com/api/v6/guilds/${guildID}`,
		{headers: {
			"Content-Type": "application/json",
			"Authorization": modules.getToken()
		}}
	)
	.then(response=>!response.ok?{json:()=>null}:response)
	.then(response => response.json())
	return ctx.GuildCache[guildID];
}
function getChannels(guildID){
	if (ctx.ChannelCache[guildID] != undefined){
		return ctx.ChannelCache[guildID];
	}
	ctx.ChannelCache[guildID] = fetch(
		`https://discordapp.com/api/v6/guilds/${guildID}/channels`,
		{headers: {
			"Content-Type": "application/json",
			"Authorization": modules.getToken()
		}}
	)
	.then(response=>!response.ok?{json:()=>null}:response)
	.then(response => response.json());
	return ctx.ChannelCache[guildID];
}
function getProfile(profileID){
	if (ctx.ProfileCache[profileID] != undefined){
		return ctx.ProfileCache[profileID];
	}
	ctx.ProfileCache[profileID] = fetch(
		`https://discord.com/api/v9/users/${profileID}/profile`,
		{headers: {
			"Content-Type": "application/json",
			"Authorization": modules.getToken()
		}}
	)
	.then(response=>!response.ok?{json:()=>null}:response)
	.then(response => response.json());
	return ctx.ProfileCache[profileID];
}

exports({getMessage,getGuild,getChannels,getProfile})