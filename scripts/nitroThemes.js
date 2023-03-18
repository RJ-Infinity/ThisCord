var AddToSettings = using("/AddToSettings.js");
var AddCss = using("/AddCss.js");

console.log("nitroThemes LOADED!");

AddCss.addCSS("NitroTheme", "apple-mint", ".custom-theme-background {--custom-theme-background: linear-gradient(180deg, var(--bg-gradient-mint-apple-1) 6.15%, var(--bg-gradient-mint-apple-2) 48.7%, var(--bg-gradient-mint-apple-3) 93.07%);}")
AddCss.addCSS("NitroTheme", "citrus-sherbert", ".custom-theme-background {--custom-theme-background: linear-gradient(180deg, var(--bg-gradient-citrus-sherbert-1) 31.1%, var(--bg-gradient-citrus-sherbert-2) 67.09%);")
AddCss.addCSS("NitroTheme", "retro-raincloud", ".custom-theme-background {--custom-theme-background: linear-gradient(148.71deg, var(--bg-gradient-retro-raincloud-1) 5.64%, var(--bg-gradient-retro-raincloud-2) 26.38%, var(--bg-gradient-retro-raincloud-2) 49.92%, var(--bg-gradient-retro-raincloud-1) 73.12%);")
AddCss.addCSS("NitroTheme", "hanami", ".custom-theme-background {--custom-theme-background: linear-gradient(38.08deg, var(--bg-gradient-hanami-1) 3.56%, var(--bg-gradient-hanami-2) 35.49%, var(--bg-gradient-hanami-3) 68.78%);}")
AddCss.addCSS("NitroTheme", "sunrise", ".custom-theme-background {--custom-theme-background: linear-gradient(154.19deg, var(--bg-gradient-sunrise-1) 8.62%, var(--bg-gradient-sunrise-2) 48.07%, var(--bg-gradient-sunrise-3) 76.04%);}")
AddCss.addCSS("NitroTheme", "candyfloss", ".custom-theme-background {--custom-theme-background: linear-gradient(180.14deg, var(--bg-gradient-cotton-candy-1) 8.5%, var(--bg-gradient-cotton-candy-2) 94.28%);}")
AddCss.addCSS("NitroTheme", "lofi-vibes", ".custom-theme-background {--custom-theme-background: linear-gradient(179.52deg, var(--bg-gradient-lofi-vibes-1) 7.08%, var(--bg-gradient-lofi-vibes-2) 34.94%, var(--bg-gradient-lofi-vibes-3) 65.12%, var(--bg-gradient-lofi-vibes-4) 96.23%);}")
AddCss.addCSS("NitroTheme", "desert-khaki", ".custom-theme-background {--custom-theme-background: linear-gradient(38.99deg, var(--bg-gradient-desert-khaki-1) 12.92%, var(--bg-gradient-desert-khaki-2) 32.92%, var(--bg-gradient-desert-khaki-3) 52.11%);}")
AddCss.addCSS("NitroTheme", "sunset", ".custom-theme-background {--custom-theme-background: linear-gradient(141.68deg, var(--bg-gradient-sunset-1) 27.57%, var(--bg-gradient-sunset-2) 71.25%);")
AddCss.addCSS("NitroTheme", "chroma-glow", ".custom-theme-background { --custom-theme-background: linear-gradient(128.92deg, var(--bg-gradient-chroma-glow-1) 3.94%, var(--bg-gradient-chroma-glow-2) 26.1%, var(--bg-gradient-chroma-glow-3) 39.82%, var(--bg-gradient-chroma-glow-4) 56.89%, var(--bg-gradient-chroma-glow-5) 76.45%);}")
AddCss.addCSS("NitroTheme", "forest", ".custom-theme-background {--custom-theme-background: linear-gradient(162.27deg, var(--bg-gradient-forest-1) 11.2%, var(--bg-gradient-forest-2) 29.93%, var(--bg-gradient-forest-3) 48.64%, var(--bg-gradient-forest-4) 67.85%, var(--bg-gradient-forest-5) 83.54%);}")
AddCss.addCSS("NitroTheme", "crimson-moon", ".custom-theme-background {--custom-theme-background: linear-gradient(64.92deg, var(--bg-gradient-crimson-moon-1) 16.17%, var(--bg-gradient-crimson-moon-2) 72%);}")
AddCss.addCSS("NitroTheme", "midnight-blurple", ".custom-theme-background {--custom-theme-background: linear-gradient(48.17deg, var(--bg-gradient-midnight-blurple-1) 11.21%, var(--bg-gradient-midnight-blurple-2) 61.92%);}")
AddCss.addCSS("NitroTheme", "mars", ".custom-theme-background {--custom-theme-background: linear-gradient(170.82deg, var(--bg-gradient-mars-1) 14.61%, var(--bg-gradient-mars-2) 74.62%);}")
AddCss.addCSS("NitroTheme", "dusk", ".custom-theme-background {--custom-theme-background: linear-gradient(180deg, var(--bg-gradient-dusk-1) 12.84%, var(--bg-gradient-dusk-2) 85.99%);}")

var template = document.createElement("template");
template.innerHTML = `
<h2 class="settings-title">Nitro Themes</h2>

<label for="themes"><br>CHOOSE A THEME</label>

<select name="themes" id="theme-selector">
<option value="none" selected>None</option>
<option value="apple-mint">Apple Mint</option>
<option value="citrus-sherbert">Citrus Sherbert</option>
<option value="retro-raincloud">Retro Raincloud</option>
<option value="hanami">Hanami</option>
<option value="sunrise">Sunrise</option>
<option value="candyfloss">Candyfloss</option>
<option value="lofi-vibes">LoFi Vibes</option>
<option value="desert-khaki">Desert Khaki</option>
<option value="sunset">Sunset</option>
<option value="chroma-glow">Chroma Glow</option>
<option value="midnight-blurple">Midnight Blurple</option>
<option value="mars">Mars</option>
<option value="dusk">Dusk</option>


</select>
<style>
#theme-selector {
	border-radius: 4px;
	font-weight: 500;
	color: var(--text-normal);
	background: var(--input-background);
	border-color: var(--input-background);
	font-style: inherit;
	font-family: inherit;
	align-items: center;
	border: 1px solid transparent;
	display: block;
	cursor: pointer;
	grid-template-columns: 1fr auto;
	padding: 8px 8px 8px 12px;
	box-sizing: border-box;
	-webkit-box-align: center;
	font-size: 100%;
	width: 100%;
}
.settings-title {
	font-weight:500;
	font-size:20px;
	line-height:24px;
	font-style: inherit;
	font-family: inherit;
}
#theme-selector option {
  padding: 12px;
  background-color: #f2f3f5;
  font-style: inherit;
  font-family: inherit;
}
#theme-selector option:hover {
  background-color: #e0e1e5;
}
#theme-selector option:checked + select {
  background-color: #e0e1e5;
}
</style>
`;
template = template.content.cloneNode(true);
template.querySelector("#theme-selector").addEventListener("change", themeHandler);

function themeHandler(e) {
	var options = e.target.options
	var value = options[options.selectedIndex].value
	AddCss.uninjectModule("NitroTheme");
	if (value!=="none"){
		AddCss.injectCSS("NitroTheme",value)
	}
}

AddToSettings.addPage("Nitro Themes", template);

var themeObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
	if (mutation.type === "attributes" && mutation.target === document.documentElement) {
		var classList = document.documentElement.classList;
		if (!classList.contains("custom-theme-background")) {
			classList.add("custom-theme-background");
		}
	}
  });
});

themeObserver.observe(document.documentElement, { attributes: true, attributeOldValue: true });
