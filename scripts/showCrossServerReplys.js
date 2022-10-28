var hooks = using("/hooks.js");
var modules = using("/modules.js");
var discordApi = using("/discordAPI.js");
var messageRenderer = using("/MessageRenderer.js")

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
	discordApi
	.getMessage(paths[1],paths[2])
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
			<b>${messageRenderer.Sanitise(json["author"]["username"])}</b>
			<p>${messageRenderer.ParseContent(json["content"])}</p>
		</div>
		`
		el.innerText = "";
		el.appendChild(MessageEmbedTemplate.content.cloneNode(true));
		messageRenderer.resolveMentions(el);
		messageRenderer.resolveChannelMentions(el,paths[0]);
		messageRenderer.resolveRoleMentions(el,paths[0]);
		messageRenderer.resolveRelativeTime(el);
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
			<b>${messageRenderer.Sanitise(json["name"])}</b>
			<p>${messageRenderer.Sanitise(json["description"]||"")}</p>
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
