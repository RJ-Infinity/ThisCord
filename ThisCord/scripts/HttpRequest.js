ctx.functions = [];

XMLHttpRequest.prototype.ThisCordDefaultOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
	var obj = {cancel:false};
	ctx.functions.forEach(fn=>fn(obj,method, url, async, user, password))
	if (!obj.cancel){
		this.ThisCordDefaultOpen(method, url, async, user, password);
	}
}

function addRequestIntercept(fn){
	if (typeof fn!="function"){
		throw "Error f must be a function"
	}
	ctx.functions.push(fn);
}
function removeRequestIntercept(fn){
	if (ctx.functions.indexOf(fn) > -1) {
		ctx.functions.splice(ctx.functions.indexOf(fn), 1);
	}
}
exports({addRequestIntercept,removeRequestIntercept});