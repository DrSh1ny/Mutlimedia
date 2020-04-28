"use strict";

(function(){
      window.addEventListener("load",main)
}());



function main(){
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var elements = new Array()
	

	mainMenu(canvas);

	canvas.addEventListener("initend",initEndHandler)
	/*
	var img = new Image();
	img.addEventListener("load",imageLoadHandler);
	img.id="box";
	img.src = "resources/New Piskel.png";
	*/

	function initEndHandler(ev){

		ctx.canvas.addEventListener("click",clickHandler)
		elements = ev.elements
		elements.forEach(element => {
			element.draw(ctx);
		});
		

		function clickHandler(ev){
			canvasClickHandler(ev,ctx,elements)
		}
	}
	
	
}

function canvasClickHandler(ev, ctx, elements)
{
	elements.forEach(element =>{
		if (element.mouseOverBoundingBox(ev)){
			switch (element.img.id) {
				case "jogar":
					ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
					menuModo(ctx)
					break;
				case "voltarMenuP":
					ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
					mainMenu(ctx.canvas);
					break;
				default:
					break;
			}
		}
	})
	
}



function menuModo(ctx){
	var nLoads = 0;	
	var startLoad = 3;
	var elements = new Array()
	var height = ctx.canvas.height;
	var width = ctx.canvas.width;
	var infinito = new Image();
	var classico = new Image();
	var voltar = new Image();
	infinito.addEventListener("load",loader);
	infinito.id = "infinito";
	infinito.xPos = width/40;
	infinito.yPos = height/4;
	infinito.src = "resources/modo_infinito.png";

	classico.addEventListener("load",loader);
	classico.id = "classico";
	classico.xPos = 9*width/20;
	classico.yPos = height/4;
	classico.src = "resources/modo_classico.png";

	voltar.addEventListener("load",loader);
	voltar.id = "voltarMenuP";
	voltar.xPos = 0;
	voltar.yPos = height - 100;
	voltar.src = "resources/Voltar.png"
	
	

	function loader(ev){

		var component;
		var img = ev.target;
		var height = img.naturalHeight;
		var width = img.naturalWidth;
		var x = img.xPos;
		var y = img.yPos;
		switch (img.id) {
			default:
				component = new Component(x,y,width,height,2,2,img);
		
		}
		
		elements.push(component);
		nLoads++;
		if(nLoads == startLoad){
			var ev2 = new Event("initend");
			ev2.elements = elements;
			canvas.dispatchEvent(ev2)
		}

	}
}

function mainMenu(canvas){

	var nLoads = 0;	
	var startLoad = 3;
	var elements = new Array()
	var height = canvas.height;
	var width = canvas.width;
	var jogar = new Image();
	var opcao = new Image();
	var creditos = new Image();
	jogar.addEventListener("load",loader);
	jogar.id = "jogar";
	jogar.xPos = 2*width/5;
	jogar.yPos = 2*height/5;
	jogar.src="resources/Jogar.png";
	
	opcao.addEventListener("load",loader);
	opcao.xPos = width/7;
	opcao.yPos = 2*height/5;
	opcao.id = "opcao"
	opcao.src = "resources/Opcao.png"
	
	creditos.addEventListener("load",loader)
	creditos.id="creditos"
	creditos.xPos = 10*width/15
	creditos.yPos = 2*height/5
	creditos.src = "resources/Creditos.png"
	

	function loader(ev){

		var component;
		var img = ev.target;
		var height = img.naturalHeight;
		var width = img.naturalWidth;
		var x = img.xPos;
		var y = img.yPos;
		switch (img.id) {
			default:
				component = new Component(x,y,width,height,2,2,img);
		
		}
		
		elements.push(component);
		nLoads++;
		if(nLoads == startLoad){
			var ev2 = new Event("initend");
			ev2.elements = elements;
			canvas.dispatchEvent(ev2)
		}

	}


}

