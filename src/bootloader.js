
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
		return window.ThisCord.createClone(window.ThisCord.modules[filename].exports);
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
	getFile(file){return fetch('http://127.0.0.1:2829/scripts'+file)},
	generateModule(file){
		if (file.substring(file.length - 5) == ".wasm"){
			const importObject = {
				imports: { imported_func: (arg) => console.log(arg) },
			};
			WebAssembly.instantiateStreaming(fetch("simple.wasm"), importObject).then(
				(obj) => obj.instance.exports.exported_func()
			);
			return {
				type: "wasm",
				exports: false,
				ctx: {},
				function: ()=>{throw "Error No Suport For Wasm Yet"}//TEMP
			}
		}
		fetch('http://127.0.0.1:2829/scripts'+file)
		.then((response) => response.text())
		.then(data => {
			if (file.substring(file.length - 3) == ".js"){
				return {
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
				}
			}
			if (file.substring(file.length - 5) == ".json"){
				return {
					type: "json",
					exports:JSON.parse(data)
				}
			}
		})
		.catch(
			error=>{
				console.error(error)
				console.error(file)
			}
		)
	},
	createClone(obj){
		switch (Object.prototype.toString.call(obj)){
			case "[object Array]":{
				return [...obj]
			}
			case "[object Object]":{
				return Object.assign(Object.create(Object.getPrototypeOf(orig)), orig);
			}
			case "[object Boolean]":
			case "[object String]":
			case "[object Undefined]":
			case "[object Null]":
			case "[object Function]":
			case "[object Number]":{
				return obj;
			}
			default:{
				console.error(
					"Warning prototype type "+
					Object.prototype.toString.call(obj)+
					" not suported not cloning object"
				);
				return obj;
			}
		}
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
				.filter(file=>file.substring(file.length - 3) == ".js" || file.substring(file.length - 5) == ".json")
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