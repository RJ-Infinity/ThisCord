
window.ThisCord = {
	modules:{},
	currentModule:"/bootloader.js",
	using(file){
		filename = window.ThisCord.parsePath(file);
		if (window.ThisCord.modules[filename] == undefined){
			throw `Error: the file ${file} does not exist`;
		}
		if (
			window.ThisCord.modules[filename].type == "js" &&
			window.ThisCord.modules[filename].exports === false
		){
			window.ThisCord.modules[filename].exports = {}

			caller = window.ThisCord.currentModule;
			window.ThisCord.currentModule = filename;

			window.ThisCord.modules[filename].function(
				window.ThisCord.using,
				window.ThisCord.exports,
				window.ThisCord.exportAs,
				window.ThisCord.modules[filename].ctx
			);
			
			window.ThisCord.currentModule = caller;
		}
		if (window.ThisCord.modules[filename].type == "json"){
			return window.ThisCord.modules[filename].exports;
		}//json can come in non object format
		return {...window.ThisCord.modules[filename].exports};
	},
	exports(obj){
		if (window.ThisCord.modules[window.ThisCord.currentModule] == undefined){
			throw "Error: should not ever be called EVER";
		}
		if (typeof obj !== "object"){
			throw "Error: the exports function takes a obj"
		}
		window.ThisCord.modules[window.ThisCord.currentModule].exports = {...window.ThisCord.modules[window.ThisCord.currentModule].exports, ...obj};
	},
	exportAs: (obj, name)=>window.ThisCord.exports({[name]:obj}),
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
		return fetch("http://127.0.0.1:2829/portal", {
			method:"post",
			body:JSON.stringify({url}),
			mode: "cors",
			headers: new Headers({
				"Content-Type": "application/json"
			})
		});
	},
	fetchScript(file){return fetch("http://127.0.0.1:2829/scripts"+file)},
	generateModule(file){
		return ThisCord
		.fetchScript(file)
		.then(response => response.text())
		.then(data => {
			if (file.substring(file.length - 3) == ".js"){
				ThisCord.modules[file] = {
					type: "js",
					exports: false,
					ctx: {},
					function: (new Function(
						"using",
						"exports",
						"exportAs",
						"ctx",
						data+"\n//# sourceURL=http://127.0.0.1:2829/scripts"+file
					))
				};
				return;
			}
			if (file.substring(file.length - 5) == ".json"){
				ThisCord.modules[file] = {
					type: "json",
					exports:JSON.parse(data)
				};
				return;
			}
		})
		// .catch(
		// 	error=>{
		// 		console.error(error)
		// 		console.error(file)
		// 	}
		// )
	}
};

(function (loops){
	if(document.querySelector(".container-1eFtFS")==null){
		if (loops<20){
			time = 250
		}else{
			time=(1+((loops-20)*(loops-20)*0.01))*250
		}
		console.log(`Discord not fully loaded.  Trying again in ${time/1000} seconds.`)
		setTimeout(arguments.callee, time, loops+1);
		//if it fails retry untill it works
		return;
	}else{
		fetch("http://127.0.0.1:2829/filesList")
		.then(response=>response.json())
		.then(
			files=>Promise.all(
				files["files"]
				.filter(
					file=>
					file.substring(file.length - 3) == ".js" ||
					file.substring(file.length - 5) == ".json"
				)
				// .filter(file=>!console.log(file))
				.map(file=>window.ThisCord.parsePath(file))
				.map(window.ThisCord.generateModule)
			)
			.then(
				_=>files["files"]
				.filter(file=>file.substring(file.length - 3) == ".js")
				.map(file=>ThisCord.using(file))
				.filter(main=>typeof main === "function")
				.forEach(main=>main())
			)
		);
	}
})(0)
//# sourceURL=http://127.0.0.1:2829/bootloader.js