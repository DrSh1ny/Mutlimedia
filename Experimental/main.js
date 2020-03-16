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

	var monstro=new Monster();
	window.setTimeInterval(draw=function(){
		window.requestAnimationFrame(draw);
		monstro.render(ctx,monstro.image,monstro.state);
	},250);
	window.setTimeInterval(monstro.changeState(),1000);

}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
