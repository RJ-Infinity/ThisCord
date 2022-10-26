var hooks = using("/hooks.js");
var Modules = using("/modules.js");

function ParseContent(content){
	content = content
	.replaceAll("<","&lt;")
	.replaceAll(">","&gt;")
	.split("\n")[0];
	return content;
}

function messageLink(el,paths){
	paths.shift();
	fetch(
		`https://discordapp.com/api/v6/channels/${paths[0]}/messages?limit=1&around=${paths[1]}`,
		{headers: {
			"Content-Type": "application/json",
			"Authorization": Modules.getToken()
		}}
	)
	.then(response => response.json())
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
			<img class="ThisCord-embed-icon" src="https://cdn.discordapp.com/avatars/${json[0]["author"]["id"]}/${json[0]["author"]["avatar"]}">
			<b>${json[0]["author"]["username"]}</b>
			<p>${ParseContent(json[0]["content"])}</p>
		</div>
		`
		el.innerText = "";
		el.appendChild(MessageEmbedTemplate.content.cloneNode(true));
	})
}
function channelLink(el,paths){
	
}
function serverLink(el,paths){
	if (paths[0] == "@me"){

	}
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
