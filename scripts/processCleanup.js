/* @Thiscord-Script
name: "Discord Process Cleanup"
author: "titushm"
version: "builtin"
description: "Automatically cleans up the ghost processes left after discord closes"
backend: true
entryPoint: "main"
*/

console.log("ProcessCleanup LOADED!");
const { app } = require('electron');
const request = require(process.cwd() + "/app.asar/node_modules/request");


app.on('before-quit', async (event) => {
	request.post("http://127.0.0.1:2829/events/close");
});
