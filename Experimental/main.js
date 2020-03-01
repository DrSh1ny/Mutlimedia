"use strict";

(function()
{
	//automatically called as soon as the javascript is loaded
	window.addEventListener("load", main);
}());


function main()
{
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var cw = canvas.width;
	var ch = canvas.height;

	setInterval(function(){ alert("Hello"); }, 3000);


}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
