var AddToSettings = using("/AddToSettings.js");

template = document.createElement("template");
template.innerHTML = `
<h1>test Page</h1>

<button> this is a button</button>
<a href="https://google.com">link</a>
`;

AddToSettings.addPage("testing",template.content.cloneNode(true));

//testing the message hook

// var hooks = using("/hooks.js");
// hooks.ForEveryMessage(function (el){
// 	Array.from(el.getElementsByClassName("messageContent-2t3eCI")).forEach(e => {
// 		var contentEl = e.firstChild
// 		console.log(el.getElementsByClassName("messageContent-2t3eCI"));
// 		if (contentEl != null && contentEl.nodeType == 3){
// 			contentEl.data = contentEl.data + "(modified)";
// 		}
// 	});
// });


// hooks.AddMessageMenuHook(console.log);

// test2Json = using("test2.json");//this uses a relative import
// console.log(test2Json);

// test3Json = using("test3.json");//this uses a relative import
// console.log(test3Json);