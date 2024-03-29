(function () {
	class VirtualClass {
		constructor(vProps) {
			if (this.constructor == VirtualClass) {
				throw "cannot create an instance of the Virtual Class";
			}
			if (Object.getPrototypeOf(this.constructor) == VirtualClass) {
				throw "cannot create an instance of a Virtual Class";
			}
			var vClass = this;
			while (Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(vClass))).constructor !== VirtualClass) {
				if (vClass.constructor === Object) {
					throw "unreachable but stops infinite loops";
				}
				vClass = Object.getPrototypeOf(vClass);
			}
			var aProps = Object.getOwnPropertyNames(Object.getPrototypeOf(vClass));
			vProps.forEach((p) => {
				if (!aProps.includes(p)) {
					throw p + " is a Virtual method and must be defined on the class that inherits off " + vClass.constructor.name;
				}
			});
		}
	}
	function stripCommentsFromJson(script) {
		let inStr = false;
		let inEsc = false;
		let inSingleLineComment = false;
		let inMultiLineComment = false;
		let newScript = "";

		for (let i = 0; i < script.length; i++) {
			if (!inMultiLineComment && !inSingleLineComment && !inEsc && script.substring(i, i + 1) == '"') {
				inStr = true;
			}
			if (!inMultiLineComment && !inSingleLineComment && !inEsc && inStr && script.substring(i, i + 1) == "\\") {
				inEsc = true;
			}
			if (i + 1 < script.length && !inStr && !inMultiLineComment && script.substring(i, i + 1) == "/" && script.substring(i + 1, i + 2) == "/") {
				inSingleLineComment = true;
			}
			if (script.substring(i, i + 1) == "\n") {
				inSingleLineComment = false;
			}
			if (i + 1 < script.length && !inStr && !inSingleLineComment && script.substring(i, i + 1) == "/" && script.substring(i + 1, i + 2) == "*") {
				inMultiLineComment = true;
			}
			if (!inSingleLineComment && !inMultiLineComment) {
				newScript += script.substring(i, i + 1);
			}
			if (i > 0 && !inStr && !inSingleLineComment && inMultiLineComment && script.substring(i, i + 1) == "/" && script.substring(i - 1, i) == "*") {
				inMultiLineComment = false;
			}
		}
		return newScript;
	}

	class ThisCord extends VirtualClass {
		constructor() {
			super(["fetchThroughPortal", "getFromServer", "getJsonFromServer", "fetchScript", "createModuleFunction", "context"]);
			this.getJsonFromServer("/filesList")
				.then((files) => {
					this._files = files;
					return files;
				})
				.then((files) =>
					Promise.all(
						files["files"]
							.filter((file) => file.substring(file.length - 3) == ".js" || file.substring(file.length - 5) == ".json")
							.map((file) => this.parsePath(file))
							.map(this.generateModule.bind(this))
					).then((_) =>
						Object.keys(this.modules)
							.filter((path) => this.modules[path].info.has("entryPoint"))
							.filter((path) => typeof this.modules[path].info.get("entryPoint") === "string")
							.map((path) => ({ path, exports: this.using(path) }))
							.map((module) => module.exports[this.modules[module.path].info.get("entryPoint")])
							.filter((main) => typeof main === "function")
							.forEach((main) => main())
					)
				);
		}
		_files;
		_currentModule = "/bootloader.js";
		get currentModule() {
			return this._currentModule;
		}
		set currentModule(val) {
			this._currentModule = val;
		}
		_modules = {};
		get modules() {
			return this._modules;
		}
		set modules(val) {
			this._modules = val;
		}
		getScriptInfo(script) {
			return new Promise((resolve, reject) => {
				let lines = script.split("\n");
				if (lines[0].substring(0, 2) !== "/*") {
					return reject("file does not start with a comment");
				}

				if (lines[0].substring(2).trimLeft().substring(0, 16) !== "@Thiscord-Script") {
					return reject("header does not start with the thiscord identifier");
				}

				if (lines[0].substring(2).trimLeft().substring(16).trim() !== "") {
					return reject("the first line must only contain the thiscord identifier");
				}

				const isValidVersionStringList = (version) => version.reduce((acc, v) => v.split("").reduce((acc, c) => !["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(c) || acc, false) || acc, false);

				let info = new Map();
				let i = 1;
				while (!lines[i].includes("*/")) {
					let property = lines[i].split(/:(.*)/s);
					if (property[1].trim()[0] == "v") {
						let version = property[1].trim().substring(1).split(".");
						if (isValidVersionStringList(version)) {
							console.warn("failed to parse the value of the property " + property[0].trim() + ". skipping.");
						}
						info.set(
							property[0].trim(),
							version.map((v) => parseInt(v))
						);
					} else {
						try {
							info.set(property[0].trim(), JSON.parse(property[1].trim()));
						} catch (e) {
							if (e instanceof SyntaxError) {
								console.warn("failed to parse the value of the property " + property[0].trim() + ". skipping.");
							} else {
								return reject(e);
							}
						}
					}
					i++;
				}
				return resolve({ script, info });
			});
		}
		generateModule(file) {
			return this.fetchScript(file)
				.then(this.getScriptInfo)
				.then(
					({ script, info }) => {
						if (!info.has(this.context) || info.get(this.context) !== true) {
							return;
						}
						if (file.substring(file.length - 3) == ".js") {
							var func = this.createModuleFunction(file, script, info);

							this.modules[file] = {
								type: "js",
								exports: false,
								hasSingleExport: false,
								function: func,
								info: info,
							};
							return;
						}
						if (file.substring(file.length - 5) == ".json") {
							this.modules[file] = {
								type: "json",
								exports: JSON.parse(stripCommentsFromJson(script)),
								info: info,
							};
							return;
						}
						console.warn(`ThisCord: ${file} not in known format. Skipping.`);
					},
					(reason) => console.warn(`ThisCord: ${file} being skipped due to the error in the UserScript comment: ${reason}`)
				);
		}
		parsePath(path) {
			var newPath = [];
			var path = path.replaceAll("\\", "/");
			if (path.substring(0, 1) != "/") {
				path = this.currentModule + "/../" + path;
			}
			path.split("/").forEach((el) => {
				if (el == "." || el == "") {
					return;
				}
				if (el == "..") {
					if (newPath.pop() === undefined) {
						throw "Error: attempted to navigate out of scripts folder";
					}
				} else {
					newPath.push(el);
				}
			});
			return "/" + newPath.join("/");
		}
		using(file) {
			//TODO(#31): stop things being rerun when they fail the first time
			var filename = this.parsePath(file);
			if (this.modules[filename] == undefined) {
				throw `Error: the file ${file} does not exist or is not specified to run in this environment.`;
			}
			if (this.modules[filename].type == "js" && this.modules[filename].exports === false) {
				this.modules[filename].exports = {};

				var caller = this.currentModule;
				this.currentModule = filename;

				try {
					this.modules[filename].function(this.using.bind(this), this.exports.bind(this), this.exportAs.bind(this), this.exportSingle.bind(this));
				} catch (e) {
					console.error(e);
					console.warn(`loading '${filename}' failed skipping`);
					this.modules[filename].exports = false;
					this.currentModule = caller;
					return {};
				}

				this.currentModule = caller;
			}
			return this.modules[filename].exports;
		}
		exports(obj) {
			if (this.modules[this.currentModule] == undefined) {
				throw "Error: should not ever be called EVER";
			}
			if (this.modules[this.currentModule].hasSingleExport) {
				throw "Error: cannot use `exports` or `exportAs` if `exportSingle` has been called in the same module";
			}
			if (typeof obj !== "object") {
				throw "Error: the exports function takes a obj";
			}
			this.modules[this.currentModule].exports = { ...this.modules[this.currentModule].exports, ...obj };
		}
		exportAs(obj, name) {
			return this.exports({ [name]: obj });
		}
		exportSingle(obj) {
			if (this.modules[this.currentModule] == undefined) {
				throw "Error: should not ever be called EVER";
			}
			if (this.modules[this.currentModule].hasSingleExport) {
				throw "Error: cannot use `exportSingle` twice in one module";
			}
			if (Object.keys(this.modules[this.currentModule].exports).length > 0) {
				throw "Error: cannot use `exportSingle` if `exports` or `exportAs` has been called in the same module";
			}
			this.modules[this.currentModule].hasSingleExport = true;
			this.modules[this.currentModule].exports = obj;
		}
	}

	if (typeof document !== "undefined") {
		(function (loops) {
			//this is the renderer
			if (document.querySelector(".container__037ed") == null) {
				//TODO(#32): ask the server to re-inject if it doesn't load for long enough
				if (loops < 20) {
					window.ThisCordTimeTillReInject = 250;
				} else {
					window.ThisCordTimeTillReInject = (1 + (loops - 20) * (loops - 20) * 0.01) * 250;
				}
				console.warn(`ThisCord: Discord not fully loaded.  Trying again in ${window.ThisCordTimeTillReInject / 1000} seconds.`);
				setTimeout(arguments.callee, window.ThisCordTimeTillReInject, loops + 1);
				//if it fails retry until it works
				return;
			} else {
				class ThisCordRenderer extends ThisCord {
					constructor() {
						super();
					}
					fetchThroughPortal(url, object) {
						return fetch(`http://127.0.0.1:2829/portal/${window.btoa(url).replaceAll("/", "-")}`, object);
					}
					getFromServer(path) {
						return fetch("http://127.0.0.1:2829" + path).then((r) => r.text());
					}
					getJsonFromServer(path) {
						return fetch("http://127.0.0.1:2829" + path).then((r) => r.json());
					}
					fetchScript(file) {
						return fetch("http://127.0.0.1:2829/scripts" + file).then((f) => f.text());
					}
					createModuleFunction(file, script, info) {
						try {
							return new Function("using", "exports", "exportAs", "exportSingle", script + "\n//# sourceURL=http://127.0.0.1:2829/scripts" + file);
						} catch (e) {
							if (e instanceof SyntaxError) {
								console.error("Syntax Error at '" + file + "' creating empty module. Below is the stack trace\n" + e.stack + "\n" + e.message);
								return function () {};
							}
						}
					}
					get context() {
						return "renderer";
					}
					/// this is the renderer only stuff
					DiscordModules = [];
					// this is some webpack magic that was modified from
					// https://stackoverflow.com/a/69868564/15755351
					updateModules() {
						webpackChunkdiscord_app.push([
							[""],
							{},
							(e) => {
								this.DiscordModules = [];
								for (let c in e.c) {
									this.DiscordModules.push(e.c[c]);
								}
							},
						]);
					}
				}
				globalThis.ThisCord = new ThisCordRenderer();
			}
		})(0);
	}
	if (typeof require !== "undefined") {
		// this is the backend
		// for some reason some installs of discord start in different locations this means that we always know where we are
		process.chdir(process.resourcesPath);

		const request = require("./app.asar/node_modules/request");
		const util = require("node:util");
		const requestPromise = util.promisify(request);
		class ThisCordBackend extends ThisCord {
			constructor() {
				super();
			}
			fetchThroughPortal() {}
			getFromServer(path) {
				return requestPromise("http://127.0.0.1:2829" + path).then((resp) => resp.body);
			}
			getJsonFromServer(path) {
				return requestPromise("http://127.0.0.1:2829" + path).then((resp) => {
					try {
						return JSON.parse(resp.body);
					} catch (e) {
						if (e instanceof SyntaxError) {
							//TODO(#33): proper error handling
						}
					}
				});
			}
			fetchScript(file) {
				return requestPromise("http://127.0.0.1:2829/scripts" + file).then((resp) => resp.body);
			}
			createModuleFunction(file, script, info) {
				return () => {
					require(this._files.install_dir + "\\scripts\\" + file);
				};
			}
			get context() {
				return "backend";
			}
		}
		globalThis.ThisCord = new ThisCordBackend();
		globalThis.using = globalThis.ThisCord.using.bind(globalThis.ThisCord);
		globalThis.exports = globalThis.ThisCord.exports.bind(globalThis.ThisCord);
		globalThis.exportAs = globalThis.ThisCord.exportAs.bind(globalThis.ThisCord);
		globalThis.exportSingle = globalThis.ThisCord.exportSingle.bind(globalThis.ThisCord);
	}
})();
//# sourceURL=http://127.0.0.1:2829/bootloader.js
