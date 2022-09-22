var imgModal = using("./imageModal.js")
var hooks = using("/hooks.js");


var svgHandler = el=>Array
.from(el.querySelectorAll(".text-sm-normal-3Zj3Iv.footer-GXWBBp > a"))
.filter(
	el=>el
	.getAttribute("href")
	.endsWith(".svg")
)
.forEach(
	el=>fetch(el.getAttribute("href"))
	.then((response) => response.text())
	.then(svg => {
		//remove old svg elements
		Array.from(el.parentElement.parentElement.parentElement.parentElement.children)
		.filter(el=>el.hasAttribute("ThisCordSvgImg"))
		.forEach(el=>el.remove());

		const blob = new Blob([svg], {type: 'image/svg+xml'});
		const url = URL.createObjectURL(blob);
		var img = document.createElement("img");
		img.src = url;
		img.setAttribute("trueSrc",el.getAttribute("href"))
		img.toggleAttribute("ThisCordSvgImg",true);
		img.style.maxWidth = "250px";
		img.style.width = "100%";
		img.style.cursor = "pointer";
		img.addEventListener("click",_=>imgModal.ShowImageModal(url,el.getAttribute("href")))
		el.parentElement.parentElement.parentElement.parentElement.appendChild(img);
	})
)
hooks.ForEveryMessage(svgHandler);

