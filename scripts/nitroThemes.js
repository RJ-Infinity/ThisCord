var AddToSettings = using("/AddToSettings.js");
console.log("nitroThemes LOADED!");

const themeData = {
	"apple-mint": ".custom-theme-background {--custom-theme-background: linear-gradient(180deg, var(--bg-gradient-mint-apple-1) 6.15%, var(--bg-gradient-mint-apple-2) 48.7%, var(--bg-gradient-mint-apple-3) 93.07%);",
	"citrus-sherbert": ".custom-theme-background {--custom-theme-background: linear-gradient(180deg, var(--bg-gradient-citrus-sherbert-1) 31.1%, var(--bg-gradient-citrus-sherbert-2) 67.09%);",
	"retro-raincloud": ".custom-theme-background {--custom-theme-background: linear-gradient(148.71deg, var(--bg-gradient-retro-raincloud-1) 5.64%, var(--bg-gradient-retro-raincloud-2) 26.38%, var(--bg-gradient-retro-raincloud-2) 49.92%, var(--bg-gradient-retro-raincloud-1) 73.12%);",
	"hanami": ".custom-theme-background {--custom-theme-background: linear-gradient(38.08deg, var(--bg-gradient-hanami-1) 3.56%, var(--bg-gradient-hanami-2) 35.49%, var(--bg-gradient-hanami-3) 68.78%);"
}

document.head.insertAdjacentHTML("beforeend", `<style></style>`);
var nitroThemesStyle = document.head.lastChild;

var template = document.createElement("template");
template.innerHTML = `
	<h1>Nitro Themes</h1>

	<label for="themes">Pick a theme!</label>

	<select name="themes" id="themes">
	<option value="apple-mint">Apple Mint</option>
	<option value="citrus-sherbert">Citrus Sherbert</option>
	<option value="retro-raincloud">Retro Raincloud</option>
	<option value="hanami">Hanami</option>
	</select>
`;
template = template.content.cloneNode(true);
template.querySelector("#themes").addEventListener("change", themeHandler);

function themeHandler(e) {
	var options = e.target.options
	var value = options[options.selectedIndex].value
	nitroThemesStyle.innerHTML = themeData[value]
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
