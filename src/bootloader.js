(function (){
	class VirtualClass{
		constructor(vProps){
			if (this.constructor == VirtualClass){throw "cannot create an instance of the Virtual Class";}
			if (Object.getPrototypeOf(this.constructor) == VirtualClass){throw "cannot create an instance of a Virtual Class";}
			var vClass = this;
			while(
				Object.getPrototypeOf(
					Object.getPrototypeOf(
						Object.getPrototypeOf(vClass)
					)
				).constructor !== VirtualClass
			){
				if (vClass.constructor === Object){throw "unreachable but stops infinite loops";}
				vClass = Object.getPrototypeOf(vClass);
			}
			var aProps = Object.getOwnPropertyNames(Object.getPrototypeOf(vClass))
			vProps.forEach(p=>{if (!aProps.includes(p)){throw p+" is a Virtual method and must be defined on the class that inherits off "+vClass.constructor.name;}});
		}
	}
	class ThisCord extends VirtualClass {
		constructor(){super([
			"using",
			"exports",
			"exportAs",
			"fetchThroughPortal",
		]);}
		_currentModule = "/bootloader.js";
		get currentModule(){return this._currentModule;}
		set currentModule(val){this._currentModule = val;}
		_modules={};
		get modules(){return this._modules;}
		set modules(val){this._modules=val;}
		getScriptInfo(script){
			try{
				var properties = script.split("/* @Thiscord-Script")[1].split("*/")[0].trim();
				var lines = properties.split("\n");
				var info = new Map();
				lines.forEach(line => {
					var property = line.split(/:(.*)/s);
					info.set(property[0], JSON.parse(property[1].trim()));
				});
				return info
			} catch {
				return false
			}
		}
	}

	if (typeof document !== "undefined"){(function(loops){//this is the renderer
		if(document.querySelector(".container-1eFtFS")==null){
			//TODO: ask the server to re-inject if it dosent load for long enough
			if (loops<20){
				window.ThisCordTimeTillReInject = 250
			}else{
				window.ThisCordTimeTillReInject=(1+((loops-20)*(loops-20)*0.01))*250
			}
			console.warn(`Discord not fully loaded.  Trying again in ${window.ThisCordTimeTillReInject/1000} seconds.`)
			setTimeout(arguments.callee, window.ThisCordTimeTillReInject, loops+1);
			//if it fails retry untill it works
			return;
		}else{
			class ThisCordRenderer extends ThisCord{
				constructor(){
					super();
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
							.map(file=>this.parsePath(file))
							.map(this.generateModule)
						).then(
							_=>files["mains"]
							.map(this.parsePath.bind(this))
							.filter(file=>file.substring(file.length - 3) == ".js")
							.filter(file=>{
								var exists = files["files"].map(this.parsePath.bind(this)).includes(file);
								if (!exists){
									console.warn(`Skiping ${file} because it does not exist`);
								}
								return exists;
							})
							.map(file=>this.using(file))
							.map(exported=>exported.main)
							.filter(main=>typeof main === "function")
							.forEach(main=>main())
						)
					);
				}
				DiscordModules=[];
				using(file){
					var filename = this.parsePath(file);
					if (this.modules[filename] == undefined){
						throw `Error: the file ${file} does not exist`;
					}
					if (
						this.modules[filename].type == "js" &&
						this.modules[filename].exports === false
					){
						this.modules[filename].exports = {}

						var caller = this.currentModule;
						this.currentModule = filename;

						try{
							this.modules[filename].function(
								this.using.bind(this),
								this.exports.bind(this),
								this.exportAs.bind(this),
								this.exportSingle.bind(this),
								this.modules[filename].ctx
							);
						}catch (e){
							console.error(e)
							console.warn(`loading '${filename}' failed skipping`)
							this.modules[filename].exports = false;
							this.currentModule = caller;
							return {};
						}
						
						this.currentModule = caller;
					}
					return this.modules[filename].exports;
				}
				exports(obj){
					if (this.modules[this.currentModule] == undefined){
						throw "Error: should not ever be called EVER";
					}
					if (this.modules[this.currentModule].hasSingleExport){
						throw "Error: cannot use `exports` or `exportAs` if `exportSingle` has been called in the same module";
					}
					if (typeof obj !== "object"){
						throw "Error: the exports function takes a obj";
					}
					this.modules[this.currentModule].exports = {...this.modules[this.currentModule].exports, ...obj};
				}
				exportAs(obj, name){return this.exports({[name]:obj});}
				exportSingle(obj){
					if (this.modules[this.currentModule] == undefined){
						throw "Error: should not ever be called EVER";
					}
					if (this.modules[this.currentModule].hasSingleExport){
						throw "Error: cannot use `exportSingle` twice in one module";
					}
					if (Object.keys(this.modules[this.currentModule].exports).length > 0){
						throw "Error: cannot use `exportSingle` if `exports` or `exportAs` has been called in the same module";
					}
					this.modules[this.currentModule].hasSingleExport = true;
					this.modules[this.currentModule].exports = obj;
				}
				parsePath(path){
					var newPath = [];
					var path = path.replaceAll("\\","/");
					if (path.substring(0,1) != "/"){
						path = this.currentModule+"/../"+path;
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
				}
				fetchThroughPortal(url,object){return fetch(
					`http://127.0.0.1:2829/portal/${window.btoa(url).replaceAll("/","-")}`,
					object
				);}
				// this is some webpack magic that was modified from
				// https://stackoverflow.com/a/69868564/15755351
				updateModules=()=>webpackChunkdiscord_app.push(
					[
						[''],
						{},
						e => {
							this.DiscordModules=[];
							for(let c in e.c){
								this.DiscordModules.push(e.c[c])
							}
						}
					]
				);
				fetchScript=file=>fetch("http://127.0.0.1:2829/scripts"+file);
				generateModule=file => this
				.fetchScript(file)
				.then(response => response.text())
				.then(data => {
					if (file.substring(file.length - 3) == ".js"){
						try{
							var func = new Function(
								"using",
								"exports",
								"exportAs",
								"exportSingle",
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
						this.modules[file] = {
							type: "js",
							exports: false,
							hasSingleExport: false,
							ctx: {},
							function: func
						};
						return;
					}
					if (file.substring(file.length - 5) == ".json"){
						this.modules[file] = {
							type: "json",
							exports:JSON.parse(data)
						};
						return;
					}
				});
			}
			window.ThisCord = new ThisCordRenderer;
		}
	})(0)}
	if (typeof require !== "undefined"){// this is the backend
		console.log("THIS IS THISCORD IN THE BACKEND")
	}
})()
//# sourceURL=http://127.0.0.1:2829/bootloader.js