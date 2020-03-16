"use strict";

(function()
{	
	window.addEventListener("load", main);
}());


function main()
{
	var sWidth = window.screen.availWidth;
	var wWidth = 550;
	var wHeight = 420;
	var wLeft = (sWidth - wWidth)/2;	//center window on the screen
	var myWindow = window.open("html/main.html", "mainWindow", "width = " + wWidth + ", height = " + wHeight + ", left = " + wLeft);
}

