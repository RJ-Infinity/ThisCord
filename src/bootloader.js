
window.RJDiscord = {
	modules:{},
	currentModule:"/bootloader.js",
	using(){
		args = arguments
		return {from:(filename)=>{
			filename = window.RJDiscord.parsePath(filename)
			if (window.RJDiscord.modules[filename] == undefined){
				window.RJDiscord.modules[filename] = {};
				var caller = window.RJDiscord.currentModule;
				window.RJDiscord.currentModule = filename;
				fetch('http://127.0.0.1:5000/scripts/'+filename).then((response) => response.text()).then(data => {
					console.log(data);
					(new Function("using","exports",data))(window.RJDiscord.using,window.RJDiscord.exports);
				});
				window.RJDiscord.currentModule = caller;
			}
			rv = {}
			if (window.RJDiscord.modules[filename] == undefined){
				args.forEach(arg=>{rv[arg] = undefined})
			}else{
				args.forEach(arg=>{
					rv[arg] = window.RJDiscord.modules[filename][arg]
				});
			}
			return rv;
		}}
	},
	exports(obj){
		if (window.RJDiscord.modules[window.RJDiscord.currentModule] == undefined){
			throw "Error: should not ever be called EVER (could be caused by manual modification of the window.RJDiscord.currentModule as a module is exporting things yet that module appers to never have been loaded)";
		}
		window.RJDiscord.modules[window.RJDiscord.currentModule] = {...window.RJDiscord.modules[window.RJDiscord.currentModule],...obj}
	},
	parsePath(path){
		newPath = [];
		path = path.replaceAll("\\","/")
		if (path.substring(0,1) != "/"){
			path = window.RJDiscord.currentModule+"/../"+path
		}
		path.split("/").forEach(el=>{
			if (el == "." || el=="") return
			if (el == "..") {
				if (newPath.pop() === undefined){
					throw "Error: attempted to navigate out of scripts folder";
				}
			}else{
				newPath.push(el);
			}
		});
		return "/"+newPath.join("/");
	}
}
fetch("http://127.0.0.1:5000/filesList").then(response=>response.json()).then(files=>{
	window.RJDiscord.mains = [];
	files["files"].forEach(file => {
		window.RJDiscord.mains.push(window.RJDiscord.using("main").from(file).main)
	});
	window.RJDiscord.mains.forEach(main=>{
		if (typeof main === "function"){
			main();
		}
	});
})


function fetchThroughPortal(url){
	return fetch("http://127.0.0.1:5000/portal", {
		method:"post",
		body:JSON.stringify({url}),
		mode: "cors",
		headers: new Headers({
			"Content-Type": "application/json"
		})
	}).then(response=>response.body)
}