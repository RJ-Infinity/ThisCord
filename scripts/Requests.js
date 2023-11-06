/* @Thiscord-Script
name: "Requests"
author: "titushm"
version: "builtin"
description: "Provides a built in api to modify and cancel http requests"
renderer: true
backend: true
*/

if (ThisCord.context === "renderer") {
	ThisCord.XMLHttpRequestSend = window.XMLHttpRequest.prototype.send;
	ThisCord.XMLHttpRequestOpen = window.XMLHttpRequest.prototype.open;
	ThisCord.XMLHttpRequestSetHeader = window.XMLHttpRequest.prototype.setRequestHeader;

	window.XMLHttpRequest.prototype.open = function (method, url) {
		this.cache = {
			method,
			url,
			headers: {},
		};
		return ThisCord.XMLHttpRequestOpen.apply(this, [method, url]);
	}; // This is to cache the url and method so it can be read on the onRequest callback

	window.XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
		this.cache.headers[header] = value;
		return ThisCord.XMLHttpRequestSetHeader.apply(this, [header, value]);
	}; // This is to cache the request headers so it can be read on the onRequest callback

	window.XMLHttpRequest.prototype.send = function (body) {
		const params = {
			cancel: false,
			url: this.cache.url,
			method: this.cache.method,
			body,
			headers: this.cache.headers,
			response: this.response,
			responseText: this.responseText,
			status: this.status,
			statusText: this.statusText,
		};
		Requests.callbacks.onRequest.forEach((callback) => callback(params));
		if (params.cancel) return;
		return ThisCord.XMLHttpRequestSend.apply(this, [params.body]);
	}; // This is to handle the onRequest callbacks
} else {
	const { session } = require("electron");
	const defaultSession = session.defaultSession;

	defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
		let body;
		try {
			body = JSON.parse(details.uploadData?.[0].bytes.toString("utf8"));
		} catch {}
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
		Requests.callbacks.onRequest.forEach((callback) => callback(params));
		callback({ cancel: params.cancel, requestHeaders: params.headers });
	});
}

class requestEvent {
	constructor() {
		this.callbacks = {
			onRequest: [],
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
