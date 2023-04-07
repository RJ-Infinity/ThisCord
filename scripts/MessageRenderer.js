var modules = using("/modules.js");
var discordApi = using("/discordAPI.js");

ctx.classes = {
	spoilerText:modules.getCssName("spoilerText")[0].className,
	hidden:modules.getCssName("hidden",["spoilerText"])[0].className,
	wrapper:"wrapper-1ZcZW-",//this has no identifying features so lets just hope it dosent disipear
	roleMention:modules.getCssName("roleMention")[0].className,
	desaturate:modules.getCssName("desaturate",["roleMention"])[0].className,
	timestamp:modules.getCssName("timestamp",["slateBlockquoteContainer"])[0].className,
}
ctx.classes.justRoleMention=ctx.classes.roleMention.substring(
	0,
	ctx.classes.roleMention.length - ctx.classes.desaturate.length - 1
)

function Sanitise(content){
	return content
	.replaceAll("&","&amp;")
	.replaceAll("<","&lt;")
	.replaceAll(">","&gt;");
}
function resolveMentions(el){
	Array.from(el.querySelectorAll("[ThisCordUnresolvedMention]")).forEach(
		el=>discordApi.getProfile(el.getAttribute("userid")).then(json=>{
			if (json == null){
				el.innerText = `<@${el.getAttribute("userid")}>`;
				return;
			}
			el.innerText = `@${Sanitise(json.user.username)}`;
		})
	);
}
function resolveChannelMentions(el, serverID){
	Array.from(el.querySelectorAll("[ThisCordUnresolvedChannelMention]")).forEach(
		// TODO: change from the /server/channels to the /channel endpoint
		// FIXME: dosent detect threads (posibly the channel endpoint fixes this)
		el=>discordApi.getChannels(serverID).then(json=>{
			var channel = json.find(r=>r.id == el.getAttribute("getChannels"))
			if (
				json == null ||
				channel == undefined
			){
				el.innerText = `<#${el.getAttribute("getChannels")}>`;
				return;
			}

			var symbolsContent = {
				hash: "<svg class=\"ThisCordChannelMentionIcon\" viewBox=\"0 0 24 24\" aria-label=\"Channel\" aria-hidden=\"false\" role=\"img\"><path fill=\"currentColor\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z\"></path></svg>",
				voice: "<svg class=\"ThisCordChannelMentionIcon\" aria-label=\"Voice Channel\" aria-hidden=\"false\" role=\"img\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M11.383 3.07904C11.009 2.92504 10.579 3.01004 10.293 3.29604L6 8.00204H3C2.45 8.00204 2 8.45304 2 9.00204V15.002C2 15.552 2.45 16.002 3 16.002H6L10.293 20.71C10.579 20.996 11.009 21.082 11.383 20.927C11.757 20.772 12 20.407 12 20.002V4.00204C12 3.59904 11.757 3.23204 11.383 3.07904ZM14 5.00195V7.00195C16.757 7.00195 19 9.24595 19 12.002C19 14.759 16.757 17.002 14 17.002V19.002C17.86 19.002 21 15.863 21 12.002C21 8.14295 17.86 5.00195 14 5.00195ZM14 9.00195C15.654 9.00195 17 10.349 17 12.002C17 13.657 15.654 15.002 14 15.002V13.002C14.551 13.002 15 12.553 15 12.002C15 11.451 14.551 11.002 14 11.002V9.00195Z\" aria-hidden=\"true\"></path></svg>",
				anouncment: "<svg class=\"ThisCordChannelMentionIcon\" aria-label=\"Anouncment Channel\" role=\"img\" aria-hidden=\"false\" viewBox=\"0 0 24 24\"><path d=\"M3.9 8.26H2V15.2941H3.9V8.26Z\" fill=\"currentColor\"></path><path d=\"M19.1 4V5.12659L4.85 8.26447V18.1176C4.85 18.5496 5.1464 18.9252 5.5701 19.0315L9.3701 19.9727C9.4461 19.9906 9.524 20 9.6 20C9.89545 20 10.1776 19.8635 10.36 19.6235L12.7065 16.5242L19.1 17.9304V19.0588H21V4H19.1ZM9.2181 17.9944L6.75 17.3826V15.2113L10.6706 16.0753L9.2181 17.9944Z\" fill=\"currentColor\"></path></svg>",
				thread: "<svg class=\"ThisCordChannelMentionIcon\" aria-label=\"Thread\" aria-hidden=\"false\" role=\"img\" viewBox=\"0 0 24 24\" fill=\"none\"><path fill=\"currentColor\" d=\"M5.43309 21C5.35842 21 5.30189 20.9325 5.31494 20.859L5.99991 17H2.14274C2.06819 17 2.01168 16.9327 2.02453 16.8593L2.33253 15.0993C2.34258 15.0419 2.39244 15 2.45074 15H6.34991L7.40991 9H3.55274C3.47819 9 3.42168 8.93274 3.43453 8.85931L3.74253 7.09931C3.75258 7.04189 3.80244 7 3.86074 7H7.75991L8.45234 3.09903C8.46251 3.04174 8.51231 3 8.57049 3H10.3267C10.4014 3 10.4579 3.06746 10.4449 3.14097L9.75991 7H15.7599L16.4523 3.09903C16.4625 3.04174 16.5123 3 16.5705 3H18.3267C18.4014 3 18.4579 3.06746 18.4449 3.14097L17.7599 7H21.6171C21.6916 7 21.7481 7.06725 21.7353 7.14069L21.4273 8.90069C21.4172 8.95811 21.3674 9 21.3091 9H17.4099L17.0495 11.04H15.05L15.4104 9H9.41035L8.35035 15H10.5599V17H7.99991L7.30749 20.901C7.29732 20.9583 7.24752 21 7.18934 21H5.43309Z\"></path><path fill=\"currentColor\" d=\"M13.4399 12.96C12.9097 12.96 12.4799 13.3898 12.4799 13.92V20.2213C12.4799 20.7515 12.9097 21.1813 13.4399 21.1813H14.3999C14.5325 21.1813 14.6399 21.2887 14.6399 21.4213V23.4597C14.6399 23.6677 14.8865 23.7773 15.0408 23.6378L17.4858 21.4289C17.6622 21.2695 17.8916 21.1813 18.1294 21.1813H22.5599C23.0901 21.1813 23.5199 20.7515 23.5199 20.2213V13.92C23.5199 13.3898 23.0901 12.96 22.5599 12.96H13.4399Z\"></path></svg>",
				none: ""
			}
			
			var symbols = [
				/*GUILD_TEXT*/symbolsContent.hash,
				/*DM*/symbolsContent.hash,
				/*GUILD_VOICE*/symbolsContent.voice,
				/*GROUP_DM*/symbolsContent.hash,
				/*GUILD_CATEGORY*/symbolsContent.hash,
				/*GUILD_ANNOUNCEMENT*/symbolsContent.anouncment,
				/*ANNOUNCEMENT_THREAD*/symbolsContent.thread,
				/*PUBLIC_THREAD*/symbolsContent.thread,
				/*PRIVATE_THREAD*/symbolsContent.thread,
				// the ones below i cannot test?
				// TODO: test the below 
				/*GUILD_STAGE_VOICE*/symbolsContent.hash,
				/*GUILD_DIRECTORY*/symbolsContent.hash,
				/*GUILD_FORUM*/symbolsContent.hash,
			]
			el.innerHTML = (
				channel.type >= 0 && channel.type < symbols.length?symbols[channel.type]:""
			)+Sanitise(channel.name);
		})
	);
}
function resolveRoleMentions(el, serverID){
	Array.from(el.querySelectorAll("[ThisCordUnresolvedRoleMention]")).forEach(
		el=>discordApi.getGuild(serverID).then(json=>{
			if (
				json == null ||
				json.roles.find(r=>r.id == el.getAttribute("RoleID")) == undefined
			){
				el.innerText = `<@&${el.getAttribute("RoleID")}>`;
				return;
			}
			el.innerText = `@${Sanitise(json.roles.find(r=>r.id == el.getAttribute("RoleID")).name)}`;
		})
	);
}
function resolveRelativeTime(el){
	Array.from(el.querySelectorAll("[ThisCordRelativeTime]")).forEach(el=>{
		setTime(el)
	});
}
function formatTime(past,unit,amount){
	if (past){
		return (amount == 1?"a":amount)+" "+unit+(amount == 1?"":"s")+" ago";
	}
	return "in "+(amount == 1?"a":amount)+" "+unit+(amount == 1?"":"s");
}
function setTime(el){
	if (!document.body.contains(el)){
		return; // the element is no longer in the dom so stop setting the time
	}
	var diff = (new Date).getTime()/1000 - (el.getAttribute("timestamp"))
	var past = diff > 0;
	diff = Math.abs(diff);
	if (diff < 1){
		el.innerText = "now";
		setTimeout(setTime,500,el);
	}
	if (diff < 60){
		el.innerText = formatTime(past,"second",Math.round(diff));
		setTimeout(setTime,(diff - (Math.round(diff)-1))*1000,el);
		return;
	}
	if (diff < 3600){
		el.innerText = formatTime(past,"minute",Math.round(diff/60));
		setTimeout(setTime,(diff - (Math.round(diff/60)-1)*60)*1000,el);
		return;
	}
	if (diff < 86400){
		el.innerText = formatTime(past,"hour",Math.round(diff/3600));
		setTimeout(setTime,(diff - (Math.round(diff/3600)-1)*3600)*1000,el);
		return;
	}
	// although from this point on the numbers might deviate slightly from what discord have i think
	// that mine is slightly more accurate as time from this point on is more relative than absolute
	// so you cannot say that somthing is a month ago only that it happened in the last month which
	// could be only seconds ago because a month is different lengths of time depending on how where
	// in the year it is positioned
	var now = new Date;
	var date = new Date(el.getAttribute("timestamp")*1000);
	if (
		date.getFullYear() == now.getFullYear() &&
		date.getMonth() == now.getMonth()
	){
		el.innerText = formatTime(past,"day",Math.round(diff/86400));
		setTimeout(setTime,(diff - (Math.round(diff/86400)-1)*86400)*1000,el);
		return;
	}
	if (date.getFullYear() == now.getFullYear()){
		el.innerText = formatTime(past,"month",Math.abs(date.getMonth() - now.getMonth()));
		setTimeout(setTime,86400000,el);
		return;
	}
	el.innerText = formatTime(past,"year",Math.abs(date.getFullYear() - now.getFullYear()));
	setTimeout(setTime,86400000,el);
	return;
}
function ParseContent(content,shouldSanitise=true){
	if (shouldSanitise){
		content = Sanitise(content);
	}
	content = content.replaceAll("\\\\","\\").replaceAll("\\/","/");
	content.match(/\|\|.*?\|\|/g)?.forEach(
		m=>content = content.replace(
			m,
			`<span class=\"${
				ctx.classes.spoilerText
			} ${
				ctx.classes.hidden
			}\">${
				m.substring(2,m.length-2)
			}</span>`
		)
	);
	content.match(/__.*?__/g)?.forEach(
		m=>content = content.replace(m,`<u>${m.substring(2,m.length-2)}</u>`)
	);
	content.match(/\*\*.*?\*\*/g)?.forEach(
		m=>content = content.replace(m,`<b>${m.substring(2,m.length-2)}</b>`)
	);
	content.match(/\*.*?\*/g)?.forEach(
		m=>content = content.replace(m,`<i>${m.substring(1,m.length-1)}</i>`)
	);

	content.match(/&lt;@!?[0-9]+&gt;/g)?.forEach(
		m=>content = content.replace(
			m,
			`<span class=\"mention ${
				ctx.classes.wrapper
			} mention\" ThisCordUnresolvedMention UserID=\"${
				m.replaceAll("&lt;","").replaceAll("&gt;","").replaceAll("@","").replaceAll("!","")
			}\"></span>`
		)
	);
	content.match(/&lt;#[0-9]+&gt;/g)?.forEach(
		m=>content = content.replace(
			m,
			`<span class=\"channelMention ${
				ctx.classes.wrapper
			} mention\" ThisCordUnresolvedChannelMention getChannels=\"${
				m.replaceAll("&lt;","").replaceAll("&gt;","").replaceAll("#","")
			}\"></span>`
		)
	);
	content.match(/&lt;@&amp;[0-9]+&gt;/g)?.forEach(
		m=>content = content.replace(
			m,
			`<span class=\"${
				ctx.classes.justRoleMention
			} ${
				ctx.classes.wrapper
			} mention\" ThisCordUnresolvedRoleMention RoleID=\"${
				m.replaceAll("&lt;","").replaceAll("&gt;","").replaceAll("@","").replaceAll("&amp;","")
			}\"></span>`
		)
	);
	content.match(/&lt;\/[^:]+:[0-9]+&gt;/g)?.forEach(
		m=>content = content.replace(
			m,
			`<span class=\"commandMention ${
				ctx.classes.wrapper
			} mention\">${
				m.substring(0,m.indexOf(":")).replaceAll("&lt;","")
			}</span>`
		)
	);
	var spentEmojis = [];
	Array.from(content).forEach(char=>{
		if ((!spentEmojis.includes(char)) && modules.testEmoji(char)){
			spentEmojis.push(char);
			content = content.replaceAll(
				char,
				`<img aria-label="${
					char
				}" src="${
					modules.getEmojiURL(modules.ToCodePoint(char))
				}" alt="${
					char
				}" draggable="false" class="ThisCordEmoji" data-type="emoji">`
			);
		}
	});
	content.match(/&lt;a?:[^:]+:[0-9]+&gt;/g)?.forEach(
		m=>{
			var n = m[4] == "a"?m.replace("a",""):m;
			content = content.replace(
				m,
				`<img aria-label=":${
					n.replaceAll("&lt;:","").substring(
						0,n.replaceAll("&lt;:","").indexOf(":")
					).replaceAll("&gt;","").replaceAll(":","")
				}:" src="https://cdn.discordapp.com/emojis/${
					n.replaceAll("&lt;:","").substring(
						n.replaceAll("&lt;:","").indexOf(":")
					).replaceAll("&gt;","").replaceAll(":","")
				}.${m[4] == "a"?"gif":"png"}" alt=":${
					n.replaceAll("&lt;:","").substring(
						0,n.replaceAll("&lt;:","").indexOf(":")
					).replaceAll("&gt;","").replaceAll(":","")
				}:" class="ThisCordEmoji">`
			)
		}
	);
	content.match(/&lt;t:[0-9]+(:[tTdDfFR])?&gt;/g)?.forEach(m=>{
		var n = m.substring(6,m.length-4);
		n = n + (n.indexOf(":") > 0?"":":f");
		var format = n[n.length-1];
		n = n.substring(0,n.length-2);
		var time = new Date(n * 1000);
		var replace = "";
		switch (format){
			case "t":{
				replace = `<span class="${
					ctx.classes.timestamp
				}">${
					("00" + time.getHours()).slice(-2)
				}:${
					("00" + time.getMinutes()).slice(-2)
				}</span>`;
			}break;
			case "T":{
				replace = `<span class="${
					ctx.classes.timestamp
				}">${
					("00" + time.getHours()).slice(-2)
				}:${
					("00" + time.getMinutes()).slice(-2)
				}:${
					("00" + time.getSeconds()).slice(-2)
				}</span>`;
			}break;
			case "d":{
				replace = `<span class="${
					ctx.classes.timestamp
				}">${
					("00" + time.getDate()).slice(-2)
				}:${
					("00" + (time.getMonth()+1)).slice(-2)
				}:${
					("0000" + (time.getFullYear()+1)).slice(-4)
				}</span>`;
			}break;
			case "D":{
				replace = `<span class="${
					ctx.classes.timestamp
				}">${
					("00" + time.getDate()).slice(-2)
				} ${
					time.toLocaleString('default', { month: 'long' })
				} ${
					("0000" + (time.getFullYear()+1)).slice(-4)
				}</span>`;
			}break;
			case "f":{
				replace = `<span class="${
					ctx.classes.timestamp
				}">${
					("00" + time.getDate()).slice(-2)
				} ${
					time.toLocaleString('default', { month: 'long' })
				} ${
					("0000" + (time.getFullYear()+1)).slice(-4)
				} ${
					("00" + time.getHours()).slice(-2)
				}:${
					("00" + time.getMinutes()).slice(-2)
				}</span>`;
			}break;
			case "F":{
				replace = `<span class="${
					ctx.classes.timestamp
				}">${
					time.toLocaleDateString("default", { weekday: 'long' })
				}, ${
					("00" + time.getDate()).slice(-2)
				} ${
					time.toLocaleString('default', { month: 'long' })
				} ${
					("0000" + (time.getFullYear()+1)).slice(-4)
				} ${
					("00" + time.getHours()).slice(-2)
				}:${
					("00" + time.getMinutes()).slice(-2)
				}</span>`;
			}break;
			case "R":{
				replace = `<span class="${
					ctx.classes.timestamp
				}" timestamp="${n}" ThisCordRelativeTime></span>`;
			}break;
			default:{
				replace=m;
			}break;
		}
		content = content.replaceAll(m,replace);
	});
	return content;
}

exports({
	ParseContent,
	resolveMentions,
	resolveChannelMentions,
	resolveRoleMentions,
	resolveRelativeTime,
	Sanitise
});
