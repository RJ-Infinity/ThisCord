/* @Thiscord-Script
name: "Graphics"
author: "titushm"
version: "builtin"
description: "Contains classes to show graphical elements"
renderer: true
*/

const Css = using("/Css.js");
const modules = using("modules.js");
const CssModule = new Css();

class MessageBox {
	constructor(title, message) {
		this.title = title;
		this.message = message;
		this.layer = document.querySelector("#app-mount").children[4].firstElementChild.children[3];
	}

	show() {
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

	destroy() {
		this.layer.innerHTML = '';
	}
}

class ImageModal {
	constructor(url, href) {
		this.url = url;
		this.href = href;
		this.layer = document.querySelector("#app-mount").children[4].firstElementChild.children[3];
	}

	async show() {
		const img = new Image();
		img.src = this.url;
		await img.decode();
		const classNames = {
			backdrop: modules.getCssName("backdrop", ["withLayer"])[0].className,
			withLayer: modules.getCssName("backdrop", ["withLayer"])[0].otherClasses["withLayer"],
			layer: modules.getCssName("layer", ["backdrop", "layer"])[0].className,
			focusLock: modules.getCssName("focusLock")[0].className,
			modal: modules.getCssName("modal", ["responsiveWidthMobile", "image"])[0].className,
			root: modules.getCssName("root", ["spinnerContainer"])[0].className,
			fullscreenOnMobile: modules.getCssName("fullscreenOnMobile", ["spinnerContainer"])[0].className,
			wrapper: modules.getCssName("wrapper", ["mobileCloseWrapper"])[0].className,
			imageWrapper: modules.getCssName("imageWrapper", ["spoiler"])[0].className,
			image: modules.getCssName("image", ["responsiveWidthMobile", "modal"]),
			anchor: modules.getCssName("anchor")[0].className,
			anchorUnderlineOnHover: modules.getCssName("anchorUnderlineOnHover")[0].className,
			downloadLink: modules.getCssName("downloadLink")[0].className
		};
		this.layer.insertAdjacentHTML('beforeend', `<div class="${classNames.backdrop} ${classNames.withLayer}" style="opacity: 0.85; background: var(--black-500);"></div>`);
		this.layer.insertAdjacentHTML('beforeend', `<div id="ThisCordImageWrapper" class="${classNames.layer}">
		<div class="${classNames.focusLock}" role="dialog" aria-labelledby=":rn:" tabindex="-1" aria-modal="true">
			<div class="${classNames.modal} ${classNames.root} ${classNames.fullscreenOnMobile}" style="opacity: 1; transform: scale(1);">
				<div class="${classNames.wrapper}">
					<div class="${classNames.imageWrapper} ${classNames.image}" style="width: ${img.naturalWidth}px; height: ${img.naturalHeight}px;">
						<img alt="Image" src="${this.url}" style="width: ${img.naturalWidth}px; height: ${img.naturalHeight}px;">
					</div>
					<a class="${classNames.anchor} ${classNames.anchorUnderlineOnHover} ${classNames.downloadLink}" href="${this.href}" rel="noreferrer noopener" target="_blank" role="button" tabindex="0">Open in Browser</a>
				</div>
			</div>
		</div>`);

		document.querySelector(`.${classNames.backdrop}`).addEventListener("click", () => (this.destroy()));
		const focusLock = document.querySelector(`.${classNames.focusLock}`);
		focusLock.focus();
		focusLock.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				e.stopPropagation();
				e.stopImmediatePropagation();
				this.destroy();
			}
		});
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
		imageModal.inject();
	}

	destroy() {
		this.layer.innerHTML = '';
	}
}

exports({ MessageBox, ImageModal });
