"use strict";

(function()
{
	window.addEventListener("load", main);
}());

function main()
{
	window.addEventListener("animationend", sendMessage);
}


function sendMessage() {
	var idMain=window.parent;
	idMain.postMessage("Ended 3", "*");

}
