var hooks = using("/hooks.js");
var modules = using("/modules.js");
var discordApi = using("/discordAPI.js");

function ParseContent(content){
	content = content
	.replaceAll("<","&lt;")
	.replaceAll(">","&gt;")
	.split("\n")[0];
	return content;
}

function messageLink(el,paths){
	paths.shift();
	discordApi
	.getMessage(paths[0],paths[1])
	.then(json => {
		MessageEmbedTemplate = document.createElement("template");
		MessageEmbedTemplate.innerHTML = `
		<style>
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
				margin-top: -60px;
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
		</style>
		<div class="ThisCord-embed">
			<img class="ThisCord-embed-icon" src="https://cdn.discordapp.com/avatars/${json["author"]["id"]}/${json["author"]["avatar"]}">
			<b>${json["author"]["username"]}</b>
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
