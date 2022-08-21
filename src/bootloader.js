
window.RJDiscord = {
	modules:{},
	currentModule:"/bootloader.js",
	using(){
		args = Array.prototype.slice.call(arguments);
		return {from:(filename)=>{
			filename = window.RJDiscord.parsePath(filename);
			if (window.RJDiscord.modules[filename].exports === false){
				window.RJDiscord.modules[filename].exports = {}

				caller = window.RJDiscord.currentModule;
				window.RJDiscord.currentModule = filename;
				
				window.RJDiscord.modules[filename].function(this.using,this.exports);
				
				window.RJDiscord.currentModule = caller;
			}
			rv = {}
			if (window.RJDiscord.modules[filename] == undefined){
				throw "Error: should not ever be called EVER";
			}else{
				args.forEach(arg=>{
					rv[arg] = window.RJDiscord.modules[filename].exports[arg]
				});
			}
			return rv;
		}}
	},
	exports(obj){
		if (window.RJDiscord.modules[window.RJDiscord.currentModule] == undefined){
			throw "Error: should not ever be called EVER";
		}
		window.RJDiscord.modules[window.RJDiscord.currentModule].exports = {...window.RJDiscord.modules[window.RJDiscord.currentModule].exports, ...obj};
	},
	parsePath(path){
		newPath = [];
		path = path.replaceAll("\\","/");
		if (path.substring(0,1) != "/"){
			path = window.RJDiscord.currentModule+"/../"+path;
		}
		path.split("/").forEach(el=>{
			if (el == "." || el=="") return;
			if (el == "..") {
				if (newPath.pop() === undefined){
					throw "Error: attempted to navigate out of scripts folder";
				}
			}else{
				newPath.push(el);
			}
		});
		return "/"+newPath.join("/");
	},
	fetchThroughPortal(url){
		return fetch("http://127.0.0.1:5000/portal", {
			method:"post",
			body:JSON.stringify({url}),
			mode: "cors",
			headers: new Headers({
				"Content-Type": "application/json"
			})
		})
	}
}
fetch("http://127.0.0.1:5000/filesList").then(response=>response.json()).then(
	files=>Promise.all(files["files"].map(file=>window.RJDiscord.parsePath(file)).map(file => fetch('http://127.0.0.1:5000/scripts/'+file).then((response) => response.text()).then(data => {
		RJDiscord.modules[file] = {};
		RJDiscord.modules[file].exports = false;
		RJDiscord.modules[file].function =
			(new Function("using","exports",data+"\n//# sourceURL=http://127.0.0.1:5000/scripts/"+file));
	}))).then(_=>
		files["files"].map(file=>RJDiscord.using("main").from(file)).forEach(main=>{
			if (typeof main === "function"){
				main();
			}
		})
	)
);

//# sourceURL=http://127.0.0.1:5000/bootloader.js