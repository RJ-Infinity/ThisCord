var modules = using("/modules.js");

ctx.MessageCache = {};
ctx.GuildCache = {};
ctx.ChannelsCache = {};
ctx.ProfileCache = {};
ctx.FriendsCache = undefined;
ctx.ChannelCache = {};

function getMessage(channelID, messageID,force=false){
	if (
		(!force) &&
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
function getGuild(guildID,force=false){
	if ((!force) && ctx.GuildCache[guildID] != undefined){
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
function getChannels(guildID,force=false){
	if ((!force) && ctx.ChannelsCache[guildID] != undefined){
		return ctx.ChannelsCache[guildID];
	}
	ctx.ChannelsCache[guildID] = fetch(
		`https://discordapp.com/api/v6/guilds/${guildID}/channels`,
		{headers: {
			"Content-Type": "application/json",
			"Authorization": modules.getToken()
		}}
	)
	.then(response=>!response.ok?{json:()=>null}:response)
	.then(response => response.json());
	return ctx.ChannelsCache[guildID];
}
function getProfile(profileID,force=false){
	if ((!force) && ctx.ProfileCache[profileID] != undefined){
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
function getFriends(force=false){
	if ((!force) && ctx.FriendsCache !== undefined){
		return ctx.FriendsCache;
	}
	ctx.FriendsCache = fetch(
		`https://discord.com/api/v9/users/@me/relationships`,
		{headers: {
			"Content-Type": "application/json",
			"Authorization": modules.getToken()
		}}
	)
	.then(response=>!response.ok?{json:()=>null}:response)
	.then(response => response.json());
	return ctx.FriendsCache;
}
function getChannel(channelID,force=false){
	if (
		(!force) &&
		ctx.ChannelCache[channelID] != undefined
	){
		return ctx.ChannelCache[channelID];
	}
	ctx.ChannelCache[channelID] = fetch(
		`https://discordapp.com/api/v6/channels/${channelID}`,
		{headers: {
			"Content-Type": "application/json",
			"Authorization": modules.getToken()
		}}
	)
	.then(response=>!response.ok?{json:()=>[]}:response)
	.then(response => response.json())
	return ctx.ChannelCache[channelID];
}

exports({getMessage,getGuild,getChannels,getProfile,getFriends,getChannel})