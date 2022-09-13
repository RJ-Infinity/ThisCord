console.log("LOADED")

document.querySelector(".wordmarkWindows-2dq6rw.wordmark-2u86JB").appendChild((()=>{
	var a =  document.createElement("span");
	a.innerText = "(ThisCord)";
	a.style.verticalAlign = "text-top";
	return a;
})())
document.querySelector(".wordmarkWindows-2dq6rw.wordmark-2u86JB").style.fontSize = "1em";


AddToSettings = using("addPage").from("/AddToSettings.js")

template = document.createElement("template")
template.innerHTML = `
<h1>test Page</h1>

<button> this is a button</button>
<a href="https://google.com">link</a>
`

AddToSettings.addPage("testing",template)

//testing the message hook

// hooks = using("ForEveryMessage").from("/hooks.js");
// hooks.ForEveryMessage(function (el){
// 	var contentEl = el.getElementsByClassName("messageContent-2t3eCI")[0].firstChild;
// 	console.log(el.getElementsByClassName("messageContent-2t3eCI"));
// 	if (contentEl != null && contentEl.nodeType == 3){
// 		contentEl.data = contentEl.data + "(modified)";
// 	}
// });
