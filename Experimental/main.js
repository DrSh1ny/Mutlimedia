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

<<<<<<< HEAD
	var monstro=new Monster();
	window.setTimeInterval(monstro.render(ctx,monstro.image,monstro.state),250);
	window.setTimeInterval(monstro.changeState(),1000);

}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
=======
	

}
>>>>>>> 83e0cbf9cc7ac034f378175cbfd17e8389ab76d9
