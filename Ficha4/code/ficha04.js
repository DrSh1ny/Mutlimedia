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
	var nLoad = 0;
	var totLoad = 1;
	var spArray = new Array(totLoad);
	var img;

	//estilos de texto
	ctx.fillStyle = "#993333";
	ctx.font = "12px helvetica";	
	ctx.textBaseline = "bottom"; 
	ctx.textAlign = "center";  

	//carregar imagens e criar sprites
	var img = new Image(); 
	img.addEventListener("load", imgLoadedHandler);
	img.id="car";
	img.src = "resources/car.png";  //dá ordem de carregamento da imagem

	function imgLoadedHandler(ev)
	{
		var img = ev.target;
		var nw = img.naturalWidth;
		var nh = img.naturalHeight;
		var sp = new SpriteImage(0, 0, nw/4, nh/4, 1, false, img);
		spArray[0] = sp;

		nLoad++;		

		if (nLoad == totLoad)
		{
			var ev2 = new Event("initend");
			ev2.spArray = spArray;
			ctx.canvas.dispatchEvent(ev2);
		}
	}	
}


//iniciar animação
function startAnim(ctx, spArray)
{
	draw(ctx, spArray);
	animLoop(ctx, spArray);	
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
function animLoop(ctx, spArray)
{	
	var al = function(time)
	{
		animLoop(ctx, spArray);
	}
	var reqID = window.requestAnimationFrame(al);

	render(ctx, spArray, reqID);
}

//resedenho, actualizações, ...
function render(ctx, spArray, reqID, dt)
{
	var cw = ctx.canvas.width;
	var ch = ctx.canvas.height;

	//apagar canvas
	ctx.clearRect(0, 0, cw, ch);

	//animar sprites
	var sp = spArray[0];
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
		animLoop(ctx, spArray);
	}
}