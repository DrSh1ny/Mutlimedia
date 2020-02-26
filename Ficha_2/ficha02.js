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
	var iteracoes=6;

	var cor1="#03a78b";
	var cor2="#c36998"

	var bounds=[];
	var shapes=[];


	var collisionCount=0;
	var inclusionCount=0;

	bounds.push(new Rectangle(-1000,0,1000,1000))
	bounds.push(new Rectangle(cw,0,1000,1000))
	bounds.push(new Rectangle(0,-1000,1000,1000))
	bounds.push(new Rectangle(0,ch,1000,1000))

	for(let i=0;i<iteracoes;i++){
		var val=true;
		while(val==true){
			var comp=Math.floor(Math.random()*maxDim+1);
			var larg=Math.floor(Math.random()*maxDim+1);

			console.log(comp + " " + larg);
			var x=Math.floor(Math.random()*cw);
			var y=Math.floor(Math.random()*ch);

			var onezero=Math.floor(Math.random()+0.5);

			if(onezero==0){
				var novo=new Circle(x,y,comp);
			}
			else {
				var novo=new Rectangle(x,y,comp,larg);
			}


			if(checkCollision(bounds,novo)==0){
				if(onezero==0){
					novo.draw(cor1);
				}
				else {
					novo.draw(cor2);
				}

				collisionCount+=checkCollision(shapes,novo);
				inclusionCount+=checkInclusion(shapes,novo);
				shapes.push(novo);

				val=false;
			}

		}
	}
	console.log(collisionCount + " "+inclusionCount);
}


function collision(shapeA,shapeB)
{
	var collided=false;

	if(((shapeA.right > shapeB.left) && (shapeA.left< shapeB.right) && (shapeA.bot> shapeB.top) && (shapeA.top < shapeB.bot))){
		collided=true;
	}

	return collided;
}

function inclusion(shapeA,shapeB)
{
	var Bincluded=false;
	var Aincluded=false;

	if(((shapeA.right > shapeB.right) && (shapeA.left< shapeB.left) && (shapeA.bot> shapeB.bot) && (shapeA.top < shapeB.top))){
		Bincluded=true;
	}

	if(((shapeB.right > shapeA.right) && (shapeB.left< shapeA.left) && (shapeB.bot> shapeA.bot) && (shapeB.top < shapeA.top))){
		Aincluded=true;
	}


	return Bincluded||Aincluded;
}


function checkCollision(shapes,shapeA)
{
	var count=0;
	var arrayLength = shapes.length;
	for (let i=0; i < arrayLength; i++) {
		if(collision(shapes[i],shapeA)==true){
			count++;
		}
	}
	return count;
}


function checkInclusion(shapes,shapeA)
{
	var count=0;
	var arrayLength = shapes.length;
	for (let i=0; i < arrayLength; i++) {
		if(inclusion(shapes[i],shapeA)==true){
			count++;
		}
	}
	return count;
}
