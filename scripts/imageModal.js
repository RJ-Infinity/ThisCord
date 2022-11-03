AddCss = using("AddCss.js");

AddCss.addCSS("ImageModal",`
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

ctx.modalTemplate = document.createElement("template");
ctx.modalTemplate.innerHTML = 
`<div id="ThisCordBackground" class="backdrop-2ByYRN withLayer-2VVmpp" style="opacity: 0.85; background: hsl(0, calc(var(--saturation-factor, 1) * 0%), 0%);"></div>
<div id="ThisCordImageWrapper" class="layer-1Ixpg3">
	<div class="focusLock-2tveLW" role="dialog" aria-label="Image" tabindex="-1" aria-modal="true">
		<div class="modal-3Crloo root-g14mjS fullscreenOnMobile-ixj0e3" style="opacity: 1; transform: scale(1);">
			<div class="wrapper-2bCXfR">
				<div class="imageWrapper-oMkQl4 image-36HiZc" style="width: 593px; height: 593px;">
					<img id="ThisCordImg" alt="Image" style="width: 593px; height: 593px;">
				</div>
				<a id="ThisCordLink" class="anchor-1MIwyf anchorUnderlineOnHover-2qPutX downloadLink-1OAglv" rel="noreferrer noopener" target="_blank" role="button" tabindex="0">Open original</a>
			</div>
		</div>
	</div>
</div>`

//TODO: add a handler for the context menu because it sends you to the wrong link

function ShowImageModal(url,href){
	var modal = ctx.modalTemplate.content.cloneNode(true);
	modal.getElementById("ThisCordImg").src = url;
	modal.getElementById("ThisCordLink").href = href;
	function cleanup(e){
		e.target.removeEventListener("click",cleanup);

		var PE = e.target.parentElement;
		
		
		document.getElementById("ThisCordBackground").remove();
		document.getElementById("ThisCordImageWrapper").remove();
		document.getElementById("ThisCordStyle").remove();

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

	Array.from(document.querySelector("div+.layerContainer-2v_Sit").children)
	.forEach(el=>{
		el.setAttribute("ThisCordOldSyle",el.getAttribute("style")?el.getAttribute("style"):"");
		el.setAttribute("style","display:none;");
	});
	AddCss.injectCSS("ImageModal");
	document.querySelector("div+.layerContainer-2v_Sit").appendChild(modal);
	document
	.getElementById("ThisCordImg")
	.parentElement
	.parentElement
	.parentElement
	.parentElement
	.focus();
}

exports({ShowImageModal});