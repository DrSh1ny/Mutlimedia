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

	var corCircle="red";
	var corRectangle="blue";


	var n=5;
	var maxDim=200;

	var shapes=[];
	//var threshold=0.5;
	for(let i=0;i<n;i++)
	{

		var novo;
		let prob=Math.random();
		if(prob<0.5){

			let raio=Math.floor(Math.random()*maxDim/2);

			let x=(Math.random()*(cw-2*raio))+raio;
			let y=(Math.random()*(ch-2*raio))+raio;

			novo=new Circle(x,y,raio);
			novo.draw(corCircle,ctx)

		}
		else{

			let comp=Math.floor(Math.random()*maxDim);
			let larg=Math.floor(Math.random()*maxDim);

			let x=(Math.random()*(cw-comp));
			let y=(Math.random()*(ch-larg));

			novo=new Rectangle(x,y,comp,larg);
			novo.draw(corRectangle,ctx);

		}

		shapes.push(novo);

	}


	var novo=colisaoInclusao(shapes);
	console.log("Colisões: "+novo[0]+"\nInclusões: "+novo[1]);
}




function colisao(shapes)
{
	var count=0;

	for(let i=0;i<shapes.length;i++){
		for(let j=i+1;j<shapes.length;j++){
			let shapeA=shapes[i];
			let shapeB=shapes[j];

			let hitA=shapeA.hitbox();
			let hitB=shapeB.hitbox();


			if(hitA[2]>hitB[3] || hitA[3]<hitB[2] || hitA[0]>hitB[1] || hitA[1]<hitB[0]){
				continue;
			}

			count++;
		}
	}

	return count;
}


function inclusao(shapes)
{
	var count=0;

	for(let i=0;i<shapes.length;i++){
		for(let j=i+1;j<shapes.length;j++){
			let shapeA=shapes[i];
			let shapeB=shapes[j];


			let hitA=shapeA.hitbox();
			let hitB=shapeB.hitbox();


			//shape A dentro de shape B
			if(hitA[0]>hitB[0] && hitA[1]<hitB[1] && hitA[2]>hitB[2] && hitA[3]<hitB[3]){
				count++;
				continue;
			}



		}
	}

	return count;
}


function colisaoInclusao(shapes){
	var countColision=0;
	var countInclusion=0;

	for(let i=0;i<shapes.length;i++){
		for(let j=i+1;j<shapes.length;j++){

			let shapeA=shapes[i];
			let shapeB=shapes[j];


			let hitA=shapeA.hitbox();
			let hitB=shapeB.hitbox();


			let count=0;

			if(hitA[0]>hitB[0] && hitA[1]<hitB[1] && hitA[2]>hitB[2] && hitA[3]<hitB[3]){
				countInclusion++;
			}

			if(!(hitA[2]>hitB[3] || hitA[3]<hitB[2] || hitA[0]>hitB[1] || hitA[1]<hitB[0])){
				countColision++;
			}



		}
	}

	return [countColision, countInclusion];
}
