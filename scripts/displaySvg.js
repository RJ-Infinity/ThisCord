/* @Thiscord-Script
name: "Display Svg"
author: "RJ_Infinity"
version: "builtin"
description: "shows preveiws of svg's when they are sent in a chat"
renderer: true
entryPoint: "main"
*/
const Graphics = using("Graphics.js");
var hooks = using("/hooks.js");
var modules = using("/modules.js");

var classes = {
	footer: modules.getCssName("footer", ["newMosaicStyle"])[0].className,
	textSmNormal: modules.getCssName("text-sm/normal"),
};
//this is beacuse the one we want always has the least other classes but there are many that have the same name that we cant determine which one it is
classes.textSmNormal = classes.textSmNormal.map(
	classObj => {
		classObj.len = Object.keys(classObj.otherClasses).length;
		return classObj;
	}
);
classes.textSmNormal = classes.textSmNormal.reduce(
	//this might not always work but it is better than the having to fix it every update
	(smallestClass, classObj) => smallestClass.len < classObj.len ? smallestClass : classObj,
	classes.textSmNormal[0]
).className;

exportAs(() => {
	var svgHandler = el => Array
		.from(el.querySelectorAll(
			"." + classes.textSmNormal +
			"." + classes.footer +
			" > a"
		))
		.filter(
			el => el
				.getAttribute("href")
				.endsWith(".svg")
		)
		.forEach(
			el => fetch(el.getAttribute("href"))
				.then((response) => response.text())
				.then(svg => {
					//remove old svg elements
					Array.from(el.parentElement.parentElement.parentElement.parentElement.children)
						.filter(el => el.hasAttribute("ThisCordSvgImg"))
						.forEach(el => el.remove());

					const blob = new Blob([svg], { type: 'image/svg+xml' });
					const url = URL.createObjectURL(blob);
					var img = document.createElement("img");
					img.src = url;
					img.setAttribute("trueSrc", el.getAttribute("href"));
					img.toggleAttribute("ThisCordSvgImg", true);
					img.style.maxWidth = "250px";
					img.style.width = "100%";
					img.style.cursor = "pointer";
					const image = new Graphics.ImageModal(url, el.getAttribute("href"));
					img.addEventListener("click", _ => image.show());
					el.parentElement.parentElement.parentElement.parentElement.appendChild(img);
				})
		);
	hooks.ForEveryMessage(svgHandler);
}, "main");
