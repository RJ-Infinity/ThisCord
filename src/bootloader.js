
window.ThisCord = {
	modules:{},
	currentModule:"/bootloader.js",
	using(){
		args = Array.prototype.slice.call(arguments);
		return {from:(filename)=>{
			filename = window.ThisCord.parsePath(filename);
			if (window.ThisCord.modules[filename].exports === false){
				window.ThisCord.modules[filename].exports = {}

				caller = window.ThisCord.currentModule;
				window.ThisCord.currentModule = filename;
				
				window.ThisCord.modules[filename].function(this.using,this.exports);
				
				window.ThisCord.currentModule = caller;
			}
			rv = {}
			if (window.ThisCord.modules[filename] == undefined){
				throw "Error: should not ever be called EVER";
			}else{
				args.forEach(arg=>{
					rv[arg] = window.ThisCord.modules[filename].exports[arg]
				});
			}
			return rv;
		}}
	},
	exports(obj){
		if (window.ThisCord.modules[window.ThisCord.currentModule] == undefined){
			throw "Error: should not ever be called EVER";
		}
		window.ThisCord.modules[window.ThisCord.currentModule].exports = {...window.ThisCord.modules[window.ThisCord.currentModule].exports, ...obj};
	},
	parsePath(path){
		newPath = [];
		path = path.replaceAll("\\","/");
		if (path.substring(0,1) != "/"){
			path = window.ThisCord.currentModule+"/../"+path;
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
	files=>Promise.all(files["files"].map(file=>window.ThisCord.parsePath(file)).map(file => fetch('http://127.0.0.1:5000/scripts/'+file).then((response) => response.text()).then(data => {
		ThisCord.modules[file] = {};
		ThisCord.modules[file].exports = false;
		ThisCord.modules[file].function =
			(new Function("using","exports",data+"\n//# sourceURL=http://127.0.0.1:5000/scripts/"+file));
	}))).then(_=>
		files["files"].map(file=>ThisCord.using("main").from(file)).forEach(main=>{
			if (typeof main === "function"){
				main();
			}
		})
	)
);

//# sourceURL=http://127.0.0.1:5000/bootloader.js