/* @Thiscord-Script
name: "Show Cross Server Reply"
author: "RJ_Infinity"
version: "builtin"
description: "Renders links to messages as the message they are linking to not just the channel name"
renderer: true
entryPoint: "main"
*/


var hooks = using("/hooks.js");
var modules = using("/modules.js");
var discordApi = using("/discordAPI.js");
var messageRenderer = using("/MessageRenderer.js");
var AddToSettings = using("/AddToSettings.js");

var template = document.createElement("template");
template.innerHTML = `
<h1>Embeds for message Links</h1>

<button> this is a button</button>
<a href="https://google.com">link</a>
`;

AddToSettings.addPage("Embeds for message Links",template.content.cloneNode(true));

function addCSS() {
	if (document.getElementById("ThisCordEmbedCSS") !== null) { return; }
	var MessageEmbedTemplate = document.createElement("template");
	// TODO(#29): split the css into the correct file (i.e. some of this is related to the MessageRenderer.js)
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
		.ThisCordChannelMentionIcon{
			width: 1em;
			height: 1em;
			position: relative;
			top: 0.1em;
		}
	</style>`;
	document.head.appendChild(MessageEmbedTemplate.content.cloneNode(true));
}

function messageLink(el, paths) {
	discordApi
	.getMessage(paths[1], paths[2])
	.then(json => {
		if (json == null) {
			console.log("ThisCord: " + paths.join("/") + " not a valid message");
			return;
		}
		// TODO(#30): switch to the new AddCss module
		addCSS(); 
		MessageEmbedTemplate = document.createElement("template");
		MessageEmbedTemplate.innerHTML = `
		<div class="ThisCord-embed">
			<img class="ThisCord-embed-icon" src="https://cdn.discordapp.com/avatars/${json["author"]["id"]}/${json["author"]["avatar"]}">
			<b>${messageRenderer.Sanitise(json["author"]["username"])}</b>
			<p>${messageRenderer.ParseContent(messageRenderer.Sanitise(json["content"]).split("\n")[0],false)}</p>
			${(
				json?.attachments?.length > 0 ||
				json?.embeds?.length > 0 ||
				json?.components?.length > 0 ||
				json?.sticker_items?.length > 0 ||
				json?.stickers?.length > 0
			) ? `
			<svg class="repliedTextContentIcon-1LQXRB" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24" style="color: var(--header-secondary);">
				<path fill-rule="evenodd" clip-rule="evenodd"
					d="M6 2C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6C22 3.79086 20.2091 2 18 2H6ZM10 8C10 6.8952 9.1032 6 8 6C6.8944 6 6 6.8952 6 8C6 9.1056 6.8944 10 8 10C9.1032 10 10 9.1056 10 8ZM9 14L6 18H18L15 11L11 16L9 14Z"
				fill="currentColor">
				</path>
			</svg>
			`: ""}
		</div>
		`;
		el.style.display = "block";
		el.innerText = "";
		el.appendChild(MessageEmbedTemplate.content.cloneNode(true));
		messageRenderer.resolveMentions(el);
		messageRenderer.resolveChannelMentions(el, paths[0]);
		messageRenderer.resolveRoleMentions(el, paths[0]);
		messageRenderer.resolveRelativeTime(el);
	});
}
function channelLink(el, paths) {
	if (paths[0] == "@me") {
		discordApi.getChannel(paths[1]).then(json => {
			MessageEmbedTemplate = document.createElement("template");
			MessageEmbedTemplate.innerHTML = `
			<div class="ThisCord-embed">
				<img class="ThisCord-embed-icon" src="https://cdn.discordapp.com/avatars/${json["recipients"][0]["id"]}/${json["recipients"][0]["avatar"]}">
				<b>${messageRenderer.Sanitise(json["recipients"][0]["username"])}</b>
			</div>
			`;
			el.innerText = "";
			el.appendChild(MessageEmbedTemplate.content.cloneNode(true));
		});
		return;
	}
	discordApi.getGuild(paths[0]).then(json => discordApi.getChannels(paths[0]).then(channels => {
		addCSS();
		if (json == null || channels == null) { return; }
		var channel = channels.find(c => c.id == paths[1]);
		if (channel == undefined) { return; }
		MessageEmbedTemplate = document.createElement("template");
		MessageEmbedTemplate.innerHTML = `
		<div class="ThisCord-embed">
			<img class="ThisCord-embed-icon" src="https://cdn.discordapp.com/icons/${json["id"]}/${json["icon"]}">
			<b>${messageRenderer.Sanitise(json["name"])}</b>
			<p>${messageRenderer.Sanitise(channel["name"])}</p>
		</div>
		`;
		el.innerText = "";
		el.appendChild(MessageEmbedTemplate.content.cloneNode(true));
	}));
}
function serverLink(el, paths) {
	if (paths[0] == "@me") { return; }
	discordApi.getGuild(paths[0]).then(json => {
		addCSS();
		MessageEmbedTemplate = document.createElement("template");
		MessageEmbedTemplate.innerHTML = `
		<div class="ThisCord-embed">
			<img class="ThisCord-embed-icon" src="https://cdn.discordapp.com/icons/${json["id"]}/${json["icon"]}">
			<b>${messageRenderer.Sanitise(json["name"])}</b>
			<p>${messageRenderer.Sanitise(json["description"] || "")}</p>
		</div>
		`;
		el.innerText = "";
		el.appendChild(MessageEmbedTemplate.content.cloneNode(true));
	});
}

exportAs(()=>{
	var messageLinkHandler = el => Array
	// FIXME(#35): can no longer rely on the message link being in an <a> as they now have a system to display that it is a
	//	discord message this means that we need to detect this retreive the message using discordAPI.getMessage and then
	//	detect the message link which can then be plugged into what is allready here however the message content needs to
	//	replace a different part of the message as the <a> is no longer there
	.from(el.querySelectorAll("a"))
	.filter(
		el => (el.getAttribute("href") || "")
		.match(/https:\/\/discord.com\/channels\/[^\s]*/g)
	)
	.forEach(
		el => {
			var paths = el.getAttribute("href").split("/").filter(
				path => path.match(/(([0-9]+)|(@me))/g)
			);
			try {
				([
					"",
					serverLink,
					channelLink,
					messageLink
				])[paths.length](el, paths);
			} catch (e) { }//TODO add error handling
		}
	);
	hooks.ForEveryMessage(messageLinkHandler);
},"main");
