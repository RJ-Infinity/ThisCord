var Css = using("/Css.js");
var modules = using("/modules.js");

const CssModule = new Css();

const imageModal = CssModule.createCss("ImageModal", `
	@keyframes expand {
		0%{
			scale: 0;
		}
		100%{
			scale: 1;
		}
	}
	@keyframes fade {
		0%{
			opacity: 0;
		}
		100%{
			opacity: 1;
		}
	}
	#ThisCordImageWrapper{
		animation: expand .5s forwards;
	}
	#ThisCordImageWrapper.closing{
		animation: expand .5s reverse;
	}
	#ThisCordImageWrapper{
		animation: fade .5s forwards;
	}
	#ThisCordImageWrapper.closing{
		animation: fade .5s reverse;
	}
`);

var modalTemplate = document.createElement("template");
modalTemplate.innerHTML = 
`<div id="ThisCordBackground" class="${
	modules.getCssName("backdrop",["withLayer"])[0].className
} ${
	modules.getCssName("withLayer")[0].className
}" style="opacity: 0.85; background: hsl(0, calc(var(--saturation-factor, 1) * 0%), 0%);"></div>
<div id="ThisCordImageWrapper" class="${
	modules.getCssName("layer",["backdrop"])[0].className
}">
	<div class="${
		modules.getCssName("focusLock")[0].className
	}" role="dialog" aria-label="Image" tabindex="-1" aria-modal="true">
		<div class="${
			modules.getCssName("modal",["responsiveWidthMobile","image"])[0].className
		} ${
			modules.getCssName("root",["spinnerContainer"])[0].className
		} ${
			modules.getCssName("fullscreenOnMobile",["spinnerContainer"])[0].className
		}" style="opacity: 1; transform: scale(1);">
			<div class="${
				modules.getCssName("wrapper",["mobileCloseWrapper"])[0].className
			}">
				<div class="${
					modules.getCssName("imageWrapper",["spoiler"])[0].className
				} ${
					modules.getCssName("image",["responsiveWidthMobile","modal"])
				}" style="width: 593px; height: 593px;">
					<img id="ThisCordImg" alt="Image" style="width: 593px; height: 593px;">
				</div>
				<a id="ThisCordLink" class="${
					modules.getCssName("anchor")[0].className
				} ${
					modules.getCssName("anchorUnderlineOnHover")[0].className
				} ${
					modules.getCssName("downloadLink")[0].className
				}" rel="noreferrer noopener" target="_blank" role="button" tabindex="0">Open in Browser</a>
			</div>
		</div>
	</div>
</div>`

var classes = {layerContainer:modules.getCssName("layerContainer")[0].className};

//TODO: add a handler for the context menu because it sends you to the wrong link

function ShowImageModal(url,href){
	var modal = modalTemplate.content.cloneNode(true);
	modal.getElementById("ThisCordImg").src = url;
	modal.getElementById("ThisCordLink").href = href;
	function cleanup(e){
		e.target.removeEventListener("click",cleanup);

		var PE = e.target.parentElement;
		
		
		document.getElementById("ThisCordBackground")?.remove?.();
		document.getElementById("ThisCordImageWrapper")?.remove?.();
		document.getElementById("ThisCordStyle")?.remove?.();

		Array.from(PE.children)
		.forEach(el=>el.setAttribute("style",el.getAttribute("ThisCordOldSyle")));
	}
	modal.getElementById("ThisCordBackground").addEventListener("click",cleanup);
	modal.getElementById("ThisCordImageWrapper").children[0]
	.addEventListener("keydown",e=>{
		if (e.key=="Escape"){
			e.stopPropagation();
			e.stopImmediatePropagation();
			document.getElementById("ThisCordBackground").click();
		}
	});

	Array.from(document.querySelector("div+."+classes.layerContainer).children)
	.forEach(el=>{
		el.setAttribute("ThisCordOldSyle",el.getAttribute("style")?el.getAttribute("style"):"");
		el.setAttribute("style","display:none;");
	});
	AddCss.injectCSS("ImageModal","ImageModal");
	document.querySelector("div+."+classes.layerContainer).appendChild(modal);
	document
	.getElementById("ThisCordImg")
	.parentElement
	.parentElement
	.parentElement
	.parentElement
	.focus();
}

exports({ShowImageModal});