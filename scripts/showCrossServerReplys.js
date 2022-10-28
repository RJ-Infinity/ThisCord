var hooks = using("/hooks.js");
var modules = using("/modules.js");
var discordApi = using("/discordAPI.js");

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
	return content;
}
function Sanitise(content){
	return content
	.replaceAll("<","&lt;")
	.replaceAll(">","&gt;");
}

function addCSS(){
	if (document.getElementById("ThisCordEmbedCSS")!==null){return;}
	MessageEmbedTemplate = document.createElement("template");
	MessageEmbedTemplate.innerHTML = `
	<style id="ThisCordEmbedCSS">
		.ThisCord-embed{
			background-color: var(--background-secondary);
			border-radius: 5px;
			display: flex;
			gap: 10px;
			width: fit-content;
			padding: 5px;
			margin-top: -40px;
			margin-bottom: -40px;
		}
		.ThisCord-embed b{
			min-width: max-content;
		}
		.ThisCord-embed-icon{
			border-radius: 50%;
			aspect-ratio: 1/1;
			height: 1.5em;
		}
		.ThisCord-embed p{
			margin: 0;
			height: 1.2em;
			overflow: hidden;
			position: relative;
		}
		.ThisCordEmoji{
			position:relative;
			height: 1.2em;
			aspect-ratio: 1/1;
			margin-bottom: -3px;
		}
	</style>`
	document.head.appendChild(MessageEmbedTemplate.content.cloneNode(true));
}

function messageLink(el,paths){
	paths.shift();
	discordApi
	.getMessage(paths[0],paths[1])
	.then(json => {
		if (json == null){
			console.log(paths.join("/")+" not a valid message");
			return;
		}
		addCSS()
		MessageEmbedTemplate = document.createElement("template");
		MessageEmbedTemplate.innerHTML = `
		<div class="ThisCord-embed">
			<img class="ThisCord-embed-icon" src="https://cdn.discordapp.com/avatars/${json["author"]["id"]}/${json["author"]["avatar"]}">
			<b>${Sanitise(json["author"]["username"])}</b>
			<p>${ParseContent(json["content"])}</p>
		</div>
		`
		el.innerText = "";
		el.appendChild(MessageEmbedTemplate.content.cloneNode(true));
	})
}
function channelLink(el,paths){
	
}
function serverLink(el,paths){
	if (paths[0] == "@me"){return;}
	discordApi.getGuild(paths[0]).then(json => {
		addCSS()
		MessageEmbedTemplate = document.createElement("template");
		MessageEmbedTemplate.innerHTML = `
		<div class="ThisCord-embed">
			<img class="ThisCord-embed-icon" src="https://cdn.discordapp.com/icons/${json["id"]}/${json["icon"]}">
			<b>${Sanitise(json["name"])}</b>
			<p>${Sanitise(json["description"]||"")}</p>
		</div>
		`
		el.innerText = "";
		el.appendChild(MessageEmbedTemplate.content.cloneNode(true));
	})
}
var messageLinkHandler = el=>Array
.from(el.querySelectorAll("a"))
.filter(
	el=>(el
	.getAttribute("href") || "")
	.match(/https:\/\/discord.com\/channels\/[^\s]*/g)
)
.forEach(
	el=>{
		var paths = el.getAttribute("href").split("/").filter(
			path=>path.match(/(([0-9]+)|(@me))/g)
		);
		try{
			([
				"",
				serverLink,
				channelLink,
				messageLink
			])[paths.length](el,paths);
		}catch(e){}//TODO add error handling
	}
)
hooks.ForEveryMessage(messageLinkHandler);
