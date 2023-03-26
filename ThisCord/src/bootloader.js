(function (loops){
	if(document.querySelector(".container-1eFtFS")==null){
		//TODO: ask the server to re-inject if it dosent load for long enough
		if (loops<20){
			time = 250
		}else{
			time=(1+((loops-20)*(loops-20)*0.01))*250
		}
		console.warn(`Discord not fully loaded.  Trying again in ${time/1000} seconds.`)
		setTimeout(arguments.callee, time, loops+1);
		//if it fails retry untill it works
		return;
	}else{
		window.ThisCord = {
			DiscordModules:[],
			modules:{},
			currentModule:"/bootloader.js",
			using(file){
				var filename = window.ThisCord.parsePath(file);
				if (window.ThisCord.modules[filename] == undefined){
					throw `Error: the file ${file} does not exist`;
				}
				if (
					window.ThisCord.modules[filename].type == "js" &&
					window.ThisCord.modules[filename].exports === false
				){
					window.ThisCord.modules[filename].exports = {}

					var caller = window.ThisCord.currentModule;
					window.ThisCord.currentModule = filename;

					try{
						window.ThisCord.modules[filename].function(
							window.ThisCord.using,
							window.ThisCord.exports,
							window.ThisCord.exportAs,
							window.ThisCord.modules[filename].ctx
						);
					}catch (e){
						console.error(e)
						console.warn(`loading '${filename}' failed skipping`)
						window.ThisCord.modules[filename].exports = false;
						window.ThisCord.currentModule = caller;
						return {};
					}
					
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
			fetchThroughPortal(url,object){
				return fetch(`http://127.0.0.1:2829/portal/${window.btoa(url).replaceAll("/","-")}`,object);
			},
			// this is some webpack magic that was modified from
			// https://stackoverflow.com/a/69868564/15755351
			updateModules:()=>webpackChunkdiscord_app.push(
				[
					[''],
					{},
					e => {
						window.ThisCord.DiscordModules=[];
						for(let c in e.c){
							window.ThisCord.DiscordModules.push(e.c[c])
						}
					}
				]
			),
			fetchScript:file=>fetch("http://127.0.0.1:2829/scripts"+file),
			generateModule:file => ThisCord
			.fetchScript(file)
			.then(response => response.text())
			.then(data => {
				if (file.substring(file.length - 3) == ".js"){
					try{
						var func = new Function(
							"using",
							"exports",
							"exportAs",
							"ctx",
							data+"\n//# sourceURL=http://127.0.0.1:2829/scripts"+file
						)
					}catch(e){
						if (e instanceof SyntaxError){
							console.error(
								"Syntax Error at '"+
								file+
								"' creating empty module. Below is the stack trace\n"+
								e.stack+
								"\n"+
								e.message
							);
							var func = function(){}
						}
					}
					ThisCord.modules[file] = {
						type: "js",
						exports: false,
						ctx: {},
						function: func
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
		};
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
				_=>files["mains"]
				.map(window.ThisCord.parsePath)
				.filter(file=>file.substring(file.length - 3) == ".js")
				.filter(file=>{
					var exists = files["files"].map(window.ThisCord.parsePath).includes(file);
					if (!exists){
						console.warn(`Skiping ${file} because it does not exist`);
					}
					return exists;
				})
				.map(file=>ThisCord.using(file))
				.map(exported=>exported.main)
				.filter(main=>typeof main === "function")
				.forEach(main=>main())
			)
		);
	}
})(0)
//# sourceURL=http://127.0.0.1:2829/bootloader.js