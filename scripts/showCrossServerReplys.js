var hooks = using("/hooks.js");
var modules = using("/modules.js");
var discordApi = using("/discordAPI.js");

function ParseContent(content){
	content = Sanitise(content)
	.split("\n")[0];
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
		div:has(a>.ThisCord-embed){
			height: 2.5em;
		}
		.ThisCord-embed{
			background-color: rgb(242, 243, 245);
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
		.ThisCord-embed img{
			border-radius: 50%;
			aspect-ratio: 1/1;
			height: 1.5em;
		}
		.ThisCord-embed p{
			margin: 0;
			height: 1.2em;
			overflow: hidden;
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
