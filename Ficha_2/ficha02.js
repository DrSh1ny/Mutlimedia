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

	/* add your code */
	var maxDim=50;
	var iteracoes=1000;

	var cor1="#03a78b";
	var cor2="#c36998"

	var shapes=[];

	shapes.push(new Rectangle(-1000,0,1000,1000))
	shapes.push(new Rectangle(cw,0,1000,1000))
	shapes.push(new Rectangle(0,-1000,1000,1000))
	shapes.push(new Rectangle(0,ch,1000,1000))


	for(let i=0,onezero=0;i<iteracoes;i++){
		var val=false;
		while(val!=true){
			var x=Math.floor(Math.random()*cw);
			var y=Math.floor(Math.random()*ch);
			var dim=Math.floor(Math.random()*maxDim);

			//decide between a rectangle and a circle
			onezero=Math.floor(Math.random()+0.5);

			switch (onezero) {
				case 0:

					var novo=new Circle(x,y,dim);

					if(checkCollision(shapes,novo)==false){
						shapes.push(novo);
						novo.draw(cor1);
						val=true;
					}
					break;

				case 1:

					var novo=new Rectangle(x,y,dim,dim);

					if(checkCollision(shapes,novo)==false){
						shapes.push(novo);
						novo.draw(cor2);
						val=true;
					}
					break;
				}
			}
		}
}


function collision(shapeA,shapeB)
{
	var collided=false;

	if(((shapeA.right > shapeB.left) && (shapeA.left< shapeB.right) && (shapeA.bot> shapeB.top) && (shapeA.top < shapeB.bot))){
		collided=true;
	}
	console.log(collided);
	return collided;
}


function checkCollision(shapes,shapeA)
{
	var arrayLength = shapes.length;
	for (let i=0; i < arrayLength; i++) {
		var val=collision(shapes[i],shapeA);
		if(val==true)
		{
			return true;
		}

	}
	return false;
}
