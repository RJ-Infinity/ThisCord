/* @Thiscord-Script
name: "Requests"
author: "titushm"
version: "builtin"
description: "Provides a built in api to modify and cancel http requests"
renderer: true
backend: true
*/

if (ThisCord.context === "renderer") {
	ThisCord.XMLHttpRequestOpen = window.XMLHttpRequest.prototype.send;
	window.XMLHttpRequest.prototype.send = function (body) {
		const params = {
			cancel: false,
			url: this.__sentry_xhr_v2__.url,
			method: this.__sentry_xhr_v2__.method,
			body,
			headers: this.__sentry_xhr_v2__.request_headers,
			response: this.response,
			responseText: this.responseText,
			status: this.status,
			statusText: this.statusText
		};
		Requests.callbacks.onRequest.forEach(callback => callback(params));
		if (params.cancel) return;
		return ThisCord.XMLHttpRequestOpen.apply(this, [params.body]);
	};
} else {
	const { session } = require('electron');
	const defaultSession = session.defaultSession;

	defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
		let body;
		try { body = JSON.parse(details.uploadData?.[0].bytes.toString('utf8')); } catch { }
		const params = {
			cancel: false,
			url: details.url,
			method: details.method,
			body: body,
			headers: details.requestHeaders,
			frame: details.frame,
			contents: details.webContents,
			resourceType: details.resourceType,
			timestamp: details.timestamp,
		};
		//TODO(#26): Make properties like body actually have an effect when changed.
		Requests.callbacks.onRequest.forEach(callback => callback(params));
		callback({ cancel: params.cancel, requestHeaders: params.headers });
	});
}

class requestEvent {
	constructor() {
		this.callbacks = {
			"onRequest": [],
		};
	}

	onRequest(callback) {
		this.callbacks.onRequest.push(callback);
	}

	removeCallback(callback) {
		const index = this.callbacks.onRequest.indexOf(callback);
		this.callbacks.onRequest.splice(index, 1);
	}
}



const Requests = new requestEvent();

exportSingle(Requests);
