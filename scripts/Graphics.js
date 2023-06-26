/* @Thiscord-Script
name: "Graphics"
author: "titushm"
version: "builtin"
description: "Contains classes to show graphical elements"
renderer: true
*/

const Css = using("/Css.js");
const modules = using("/modules.js");


const CssModule = new Css();

class MessageBox {
	constructor(title, message) {
		this.title = title;
		this.message = message;
		this.layer = document.querySelector("#app-mount").children[4].firstElementChild.children[3];
	}

	show () {
		this.layer.insertAdjacentHTML('beforeend', '<div class="backgroundSmoke"></div>');
		this.layer.insertAdjacentHTML('beforeend', `<div class="layerContainer">
		<div class="focusLock" role="dialog" aria-labelledby=":rn:" tabindex="-1" aria-modal="true">
			<div class="root" style="opacity: 1; transform: scale(1);">
				<div class="header" id=":rn:" style="flex: 0 0 auto;">
					<div class="title">${this.title}</div>
					<div class="content" style="color: var(--header-secondary);">${this.message}</div>
					<button aria-label="Close" type="button" class="closeButton">
						<div class="closeButtonContents">
							<svg aria-hidden="true" role="img" class="closeIcon" width="24" height="24" viewBox="0 0 24 24">
								<path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path>
							</svg>
						</div>
					</button>
					</div>
				</div>
			</div>
		</div>`);

		const messageBoxCss = CssModule.createCss("messageBoxCss", `
			.backgroundSmoke {
					opacity: 0.85;
					background: var(--black-500);
					pointer-events: all;
					position: fixed;
					top: 0;
					right: var(--devtools-sidebar-width,0);
					bottom: 0;
					left: 0;
					-webkit-transform: translateZ(0);
					transform: translateZ(0);
				}
				
			.layerContainer {
				position:absolute;
				top:0;
				left:0;
				right:var(--devtools-sidebar-width,0);
				bottom:0;
				background:none!important;
				pointer-events:none;
				z-index:1002;
				-webkit-box-align:center;
				-ms-flex-align:center;
				align-items:center;
				display:-webkit-box;
				display:-ms-flexbox;
				display:flex;
				-webkit-box-pack:center;
				-ms-flex-pack:center;
				justify-content:center;
				-webkit-box-orient:vertical;
				-webkit-box-direction:normal;
				-ms-flex-direction:column;
				flex-direction:column;
				min-height:0;
				padding-top:40px;
				padding-bottom:40px
			}

			.root {
				background-color: var(--modal-background);
				border-radius: 4px;
				margin: 0 auto;
				pointer-events: all;
				position: relative;
				max-height: 100%;
				width: 440px;
				max-height: 720px;
				min-height: 200px;
				-webkit-box-shadow: var(--light-elevation-border),var(--light-elevation-high);
				box-shadow: var(--light-elevation-border),var(--light-elevation-high);
			}

			.header {
				-webkit-box-orient: horizontal;
				-webkit-box-direction: normal;
				-ms-flex-direction: row;
				flex-direction: row;
				-webkit-box-pack: start;
				-ms-flex-pack: start;
				justify-content: flex-start;
				-ms-flex-wrap: nowrap;
				flex-wrap: nowrap;
				border-radius: 4px 4px 0 0;
				-webkit-transition: -webkit-box-shadow .1s ease-out;
				transition: -webkit-box-shadow .1s ease-out;
				transition: box-shadow .1s ease-out;
				transition: box-shadow .1s ease-out,-webkit-box-shadow .1s ease-out;
				word-wrap: break-word;
				position: relative;
				-webkit-box-flex: 0;
				-ms-flex: 0 0 auto;
				flex: 0 0 auto;
				padding: 16px;
				z-index: 1;
				overflow-x: hidden;
				display: -webkit-box;
				display: -ms-flexbox;
				display: flex;
				-webkit-box-orient: vertical;
				-webkit-box-direction: normal;
				-ms-flex-direction: column;
				flex-direction: column;
				-webkit-box-align: center;
				-ms-flex-align: center;
				align-items: center;
				padding-top: 24px;
				padding-bottom: 24px;
			}

			.title {
				color: var(--header-primary);
				font-size: 24px;
				line-height: 30px;
				text-align: center;
				font-weight: 700;
			}

			.content {
				font-weight: 400;
				font-family: var(--font-primary);
				font-size: 16px;
				line-height: 20px;
				margin-top: 8px;
				text-align: center;
			}

			.closeButton {
				position: absolute;
				top: 16px;
				right: 16px;
				height: 26px;
				padding: 4px;
				-webkit-transition: opacity .2s ease-in-out;
				transition: opacity .2s ease-in-out;
				opacity: .5;
				cursor: pointer;
				border-radius: 3px;
				color: var(--interactive-normal);
				-webkit-box-sizing: content-box;
				box-sizing: content-box;
				display: -webkit-box;
				display: -ms-flexbox;
				display: flex;
				-webkit-box-pack: center;
				-ms-flex-pack: center;
				justify-content: center;
				-webkit-box-align: center;
				-ms-flex-align: center;
				align-items: center;
				-webkit-box-sizing: border-box;
				box-sizing: border-box;
				background: none;
				border: none;
				border-radius: 3px;
				font-size: 14px;
				font-weight: 500;
				line-height: 16px;
				padding: 2px 16px;
				-webkit-user-select: none;
				-moz-user-select: none;
				-ms-user-select: none;
				user-select: none;
				background: transparent;
				color: currentColor;
				border: 0;
				padding: 0;
				margin: 0;
				width: auto;
			}
			
			.closeButton:hover {
				opacity: 1;
				color: var(--interactive-hover);
			}

			.closeButtonContents {
				--button--underline-color: transparent;
				background-image: linear-gradient(0deg,transparent,transparent 1px,var(--button--underline-color) 0,var(--button--underline-color) 2px,transparent 0);
			}
			`);

		messageBoxCss.inject();
		document.querySelector(".closeButton").addEventListener("click", () => (this.destroy()));
		document.querySelector(".backgroundSmoke").addEventListener("click", () => (this.destroy()));

	}

	destroy () {
		this.layer.innerHTML = '';
	}
}

exports({ MessageBox });

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

var classes = {
	backdrop: modules.getCssName("backdrop",["withLayer"])[0].className,
	withLayer: modules.getCssName("withLayer")[0].className,
	layer: modules.getCssName("layer",["backdrop"])[0].className,
	focusLock: modules.getCssName("focusLock")[0].className,
	modal: modules.getCssName("modal",["responsiveWidthMobile","image"])[0].className,
	root: modules.getCssName("root",["spinnerContainer"])[0].className,
	fullscreenOnMobile: modules.getCssName("fullscreenOnMobile",["spinnerContainer"])[0].className,
	wrapper: modules.getCssName("wrapper",["mobileCloseWrapper"])[0].className,
	imageWrapper: modules.getCssName("imageWrapper",["spoiler"])[0].className,
	image: modules.getCssName("image",["responsiveWidthMobile","modal"]),
	anchor: modules.getCssName("anchor")[0].className,
	anchorUnderlineOnHover: modules.getCssName("anchorUnderlineOnHover")[0].className,
	downloadLink: modules.getCssName("downloadLink")[0].className,


}

var modalTemplate = document.createElement("template");
modalTemplate.innerHTML = 
`<div id="ThisCordBackground" class="${classes.backdrop} ${classes.withLayer}" style="opacity: 0.85; background: hsl(0, calc(var(--saturation-factor, 1) * 0%), 0%);"></div>
<div id="ThisCordImageWrapper" class="${classes.layer}">
	<div class="${classes.focusLock}" role="dialog" aria-label="Image" tabindex="-1" aria-modal="true">
		<div class="${classes.modal} ${classes.root} ${classes.fullscreenOnMobile}" style="opacity: 1; transform: scale(1);">
			<div class="${classes.wrapper}">
				<div class="${classes.imageWrapper} ${classes.image}" style="width: 593px; height: 593px;">
					<img id="ThisCordImg" alt="Image" style="width: 593px; height: 593px;">
				</div>
				<a id="ThisCordLink" class="${classes.anchor} ${classes.anchorUnderlineOnHover} ${classes.downloadLink}" rel="noreferrer noopener" target="_blank" role="button" tabindex="0">Open in Browser</a>
			</div>
		</div>
	</div>
</div>`

var classes = {layerContainer:modules.getCssName("layerContainer")[0].className};

//TODO(#28): add a handler for the context menu because it sends you to the wrong link

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
	imageModal.inject()
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
