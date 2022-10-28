var modules = using("/modules.js");
var discordApi = using("/discordAPI.js");


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
		el=>discordApi.getChannels(serverID).then(json=>{
			if (
				json == null ||
				json.find(r=>r.id == el.getAttribute("getChannels")) == undefined
			){
				el.innerText = `<#${el.getAttribute("getChannels")}>`;
				return;
			}
			el.innerText = `#${Sanitise(json.find(r=>r.id == el.getAttribute("getChannels")).name)}`;
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
	past = diff > 0;
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
function ParseContent(content){
	content = Sanitise(content)
	.split("\n")[0];
	content = content.replaceAll("\\\\","\\").replaceAll("\\/","/");
	content.match(/\|\|.*?\|\|/g)?.forEach(
		m=>content = content.replace(
			m,
			`<span class=\"spoilerText-27bIiA hidden-3B-Rum\">${
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
			`<span class=\"mention wrapper-1ZcZW- mention\" ThisCordUnresolvedMention UserID=\"${
				m.replaceAll("&lt;","").replaceAll("&gt;","").replaceAll("@","").replaceAll("!","")
			}\"></span>`
		)
	);
	content.match(/&lt;#[0-9]+&gt;/g)?.forEach(
		m=>content = content.replace(
			m,
			`<span class=\"channelMention wrapper-1ZcZW- mention\" ThisCordUnresolvedChannelMention getChannels=\"${
				m.replaceAll("&lt;","").replaceAll("&gt;","").replaceAll("#","")
			}\"></span>`
		)
	);
	content.match(/&lt;@&amp;[0-9]+&gt;/g)?.forEach(
		m=>content = content.replace(
			m,
			`<span class=\"roleMention-11Aaqi wrapper-1ZcZW- mention\" ThisCordUnresolvedRoleMention RoleID=\"${
				m.replaceAll("&lt;","").replaceAll("&gt;","").replaceAll("@","").replaceAll("&amp;","")
			}\"></span>`
		)
	);
	content.match(/&lt;\/[^:]+:[0-9]+&gt;/g)?.forEach(
		m=>content = content.replace(
			m,
			`<span class=\"commandMention wrapper-1ZcZW- mention\">${
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
				replace = "<span class=\"timestamp-6-ptG3\">"+
				("00" + time.getHours()).slice(-2)+
				":"+("00" + time.getMinutes()).slice(-2)
				"</span>";
			}break;
			case "T":{
				replace = "<span class=\"timestamp-6-ptG3\">"+
				("00" + time.getHours()).slice(-2)+
				":"+("00" + time.getMinutes()).slice(-2)+
				":"+("00" + time.getSeconds()).slice(-2)
				"</span>";
			}break;
			case "d":{
				replace = "<span class=\"timestamp-6-ptG3\">"+
				("00" + time.getDate()).slice(-2)+
				"/"+("00" + (time.getMonth()+1)).slice(-2)+
				"/"+("0000" + (time.getFullYear()+1)).slice(-4)
				"</span>";
			}break;
			case "D":{
				replace = "<span class=\"timestamp-6-ptG3\">"+
				("00" + time.getDate()).slice(-2)+
				" "+time.toLocaleString('default', { month: 'long' })+
				" "+("0000" + (time.getFullYear()+1)).slice(-4)
				"</span>";
			}break;
			case "f":{
				replace = "<span class=\"timestamp-6-ptG3\">"+
				("00" + time.getDate()).slice(-2)+
				" "+time.toLocaleString('default', { month: 'long' })+
				" "+("0000" + (time.getFullYear()+1)).slice(-4)+
				" "+("00" + time.getHours()).slice(-2)+
				":"+("00" + time.getMinutes()).slice(-2)
				"</span>";
			}break;
			case "F":{
				replace = "<span class=\"timestamp-6-ptG3\">"+
				time.toLocaleDateString("default", { weekday: 'long' })+
				", "+("00" + time.getDate()).slice(-2)+
				" "+time.toLocaleString('default', { month: 'long' })+
				" "+("0000" + (time.getFullYear()+1)).slice(-4)+
				" "+("00" + time.getHours()).slice(-2)+
				":"+("00" + time.getMinutes()).slice(-2)+
				"</span>";
			}break;
			case "R":{
				replace = `<span class=\"timestamp-6-ptG3\" timestamp=\"${n}\" ThisCordRelativeTime></span>`;
			}break;
			default:{
				replace=m;
			}break;
		}
		content = content.replaceAll(m,replace);
	});
	return content;
}

exports({ParseContent,resolveMentions,resolveChannelMentions,resolveRoleMentions,resolveRelativeTime,Sanitise});
