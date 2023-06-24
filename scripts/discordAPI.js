var modules = using("/modules.js");

var MessageCache = {};
var GuildCache = {};
var ChannelsCache = {};
var ProfileCache = {};
var FriendsCache = undefined;
var ChannelCache = {};

function getMessage(channelID, messageID,force=false){
	if (
		(!force) &&
		MessageCache[channelID] != undefined &&
		MessageCache[channelID][messageID] != undefined
	){
		return MessageCache[channelID][messageID];
	}
	if (MessageCache[channelID] == undefined){
		MessageCache[channelID] = {};
	}
	MessageCache[channelID][messageID] = fetch(
		`https://discordapp.com/api/v6/channels/${channelID}/messages?limit=1&around=${messageID}`,
		{headers: {
			"Content-Type": "application/json",
			"Authorization": modules.getToken()
		}}
	)
	.then(response=>!response.ok?{json:()=>[]}:response)
	.then(response => response.json())
	.then(json=>json.length == 0?null:json[0]);
	return MessageCache[channelID][messageID]
}
function getGuild(guildID,force=false){
	if ((!force) && GuildCache[guildID] != undefined){
		return GuildCache[guildID];
	}
	GuildCache[guildID] = fetch(
		`https://discordapp.com/api/v6/guilds/${guildID}`,
		{headers: {
			"Content-Type": "application/json",
			"Authorization": modules.getToken()
		}}
	)
	.then(response=>!response.ok?{json:()=>null}:response)
	.then(response => response.json())
	return GuildCache[guildID];
}
function getChannels(guildID,force=false){
	if ((!force) && ChannelsCache[guildID] != undefined){
		return ChannelsCache[guildID];
	}
	ChannelsCache[guildID] = fetch(
		`https://discordapp.com/api/v6/guilds/${guildID}/channels`,
		{headers: {
			"Content-Type": "application/json",
			"Authorization": modules.getToken()
		}}
	)
	.then(response=>!response.ok?{json:()=>null}:response)
	.then(response => response.json());
	return ChannelsCache[guildID];
}
function getProfile(profileID,force=false){
	if ((!force) && ProfileCache[profileID] != undefined){
		return ProfileCache[profileID];
	}
	ProfileCache[profileID] = fetch(
		`https://discord.com/api/v9/users/${profileID}/profile`,
		{headers: {
			"Content-Type": "application/json",
			"Authorization": modules.getToken()
		}}
	)
	.then(response=>!response.ok?{json:()=>null}:response)
	.then(response => response.json());
	return ProfileCache[profileID];
}
function getFriends(force=false){
	if ((!force) && FriendsCache !== undefined){
		return FriendsCache;
	}
	FriendsCache = fetch(
		`https://discord.com/api/v9/users/@me/relationships`,
		{headers: {
			"Content-Type": "application/json",
			"Authorization": modules.getToken()
		}}
	)
	.then(response=>!response.ok?{json:()=>null}:response)
	.then(response => response.json());
	return FriendsCache;
}
function getChannel(channelID,force=false){
	if (
		(!force) &&
		ChannelCache[channelID] != undefined
	){
		return ChannelCache[channelID];
	}
	ChannelCache[channelID] = fetch(
		`https://discordapp.com/api/v6/channels/${channelID}`,
		{headers: {
			"Content-Type": "application/json",
			"Authorization": modules.getToken()
		}}
	)
	.then(response=>!response.ok?{json:()=>[]}:response)
	.then(response => response.json())
	return ChannelCache[channelID];
}

exports({getMessage,getGuild,getChannels,getProfile,getFriends,getChannel})