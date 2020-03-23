"use strict";

(function()
{
	window.addEventListener("load", main);
}());


function main()
{
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var spArray;  //sprite array
	canvas.addEventListener("initend", initEndHandler);
	init(ctx);  //carregar todos os componentes
	
	

	//funções locais para gestão de eventos
	function initEndHandler(ev)
	{
		//instalar listeners do rato
		ctx.canvas.addEventListener("click", cch);

		spArray = ev.spArray;
		//iniciar a animação
		startAnim(ctx, spArray);
	}

	var cch = function(ev)
	{
		canvasClickHandler(ev, ctx, spArray);
	}
}


//init: carregamento de componentes
function init(ctx)
{	
	var start=null;
	var nLoad = 0;
	var totLoad = 2;
	var spArray = new Array(totLoad);
	var imgCar,imgTurb;
	var canvas = document.getElementById("canvas");
	//estilos de texto
	ctx.fillStyle = "#993333";
	ctx.font = "12px helvetica";
	ctx.textBaseline = "bottom";
	ctx.textAlign = "center";

	//carregar imagens e criar sprites
	var imgCar = new Image();
	imgCar.addEventListener("load", imgLoadedHandler);
	imgCar.id="car";
	imgCar.src = "resources/car.png";  //dá ordem de carregamento da imagem
	
	var imgTurb = new Image();
	imgTurb.addEventListener("load",imgLoadedHandler);
	imgTurb.id="turbo";
	imgTurb.src="resources/turbo.png";


	function imgLoadedHandler(ev)
	{
		switch (ev.target.id) {
			case "car":

				var img = ev.target;
				var nw = img.naturalWidth;
				var nh = img.naturalHeight;
				var sp = new SpriteImage(0, 0, Math.round(nw/2), Math.round(nh/2), 1, false, img);
				spArray[0] = sp;

				nLoad++;
				break;
			case "turbo":
				var img = ev.target;
				var nw = img.naturalWidth;
				var nh = img.naturalHeight;
				var sp = new SpriteImage(Math.round(canvas.width/2), 30, nw, nh, 1, true, img);
				spArray[1] = sp;

				nLoad++;
				break;
			default:
				break;
		}
		if (nLoad == totLoad)
				{
					var ev2 = new Event("initend");
					ev2.spArray = spArray;
					ctx.canvas.dispatchEvent(ev2);


				}

	}
}


//iniciar animação
function startAnim(ctx, spArray)		//primeira chamada 
{
	draw(ctx, spArray);
	animLoop(ctx, spArray,0);
}


//desenhar sprites
function draw(ctx, spArray)
{
	var dim = spArray.length;
	
	for (let i = 0; i < dim; i++)
	{
		spArray[i].draw(ctx);

	}
}


//apagar sprites
function clear(ctx, spArray)
{
	var dim = spArray.length;

	for (let i = 0; i < dim; i++)
	{
		spArray[i].clear(ctx);
	}
}


//-------------------------------------------------------------
//--- controlo da animação: coração da aplicação!!!
//-------------------------------------------------------------
var auxDebug = 0;  //eliminar
function animLoop(ctx, spArray,startTime,time)		//funcao intermediaria que chama o render
{
	
	
	

	var al = function(time)
	{	
		if(startTime==0){
			startTime=time;
		}
		
		animLoop(ctx, spArray,startTime,time);
	}

	var reqID = window.requestAnimationFrame(al);

	render(ctx, spArray, reqID,time-startTime);
	
}

//resedenho, actualizações, ...funcao chamada para 60fps, atualiza as posicoes,o texto, tempo, clear a canvas e volta a desenhar
function render(ctx, spArray, reqID, dt)
{	
	var cw = ctx.canvas.width;
	var ch = ctx.canvas.height;

	//animar sprites
	var sp = spArray[0];
	var turbo=spArray[1];

	//verificar se turbo toca no carro e aumentar velocidade do carro
	if(sp.checkCollision(sp,turbo)==true){  
		sp.speed+=3;
	}
	//apagar canvas
	ctx.clearRect(0, 0, cw, ch);

	

	
	

	if (sp.x + sp.width < cw)
	{
		if (sp.x + sp.width + sp.speed > cw)
			sp.x = cw - sp.width;
		else
			sp.x = sp.x + sp.speed;
	}
	else
	{
		window.cancelAnimationFrame(reqID);

		//make clickable
		sp.clickable = true;
	}


	//redesenhar sprites e texto
	var txt = "Time: " + Math.round(dt) + " msec";
	ctx.fillText(txt, cw/2, ch);
	draw(ctx, spArray);
}


//-------------------------------------------------------------
//--- interacção com o rato
//-------------------------------------------------------------
function canvasClickHandler(ev, ctx, spArray)
{	
	if (spArray[0].clickedBoundingBox(ev))
	{	
		
		spArray[0].reset(ev, ctx);
		animLoop(ctx, spArray,0,0);
	}
}
