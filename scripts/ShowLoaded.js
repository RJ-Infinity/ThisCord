console.log("LOADED")

var modules = using("/modules.js");
var wordmark = "."+modules.getCssName("wordmarkWindows")[0].className.replace(" ",".")

document.querySelector(wordmark).appendChild((()=>{
	var a =  document.createElement("span");
	a.innerText = "(ThisCord)";
	// vertical-align: text-top;
	a.style.verticalAlign = "text-top";
	// font-family: var(--font-display);
	a.style.fontFamily = "var(--font-display)";
	// font-size: 0.6em;
	a.style.fontSize = ".7em";
	// font-weight: 700;
	a.style.fontWeight = "700";
	// line-height: 13px;
	a.style.lineHeight = "13px";
	// display: inline-block;
	a.style.display = "inline-block";
	// margin-top: 0.2em;
	a.style.marginTop = "0.2em";
	return a;
})())
document.querySelector(wordmark).style.fontSize = "1em";

exports({main:()=>{console.log("RunningMain")}})