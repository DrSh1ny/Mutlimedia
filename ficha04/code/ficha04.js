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

	var som = new Audio("resources/turbo.mp3");
	init(ctx,som);  //carregar todos os componentes
	
	
	//funções locais para gestão de eventos
	function initEndHandler(ev)
	{
		//instalar listeners do rato
		ctx.canvas.addEventListener("click", cch);
		spArray = ev.spArray;
		//iniciar a animação
		startAnim(ctx, spArray,som);
	}

	var cch = function(ev)
	{
		canvasClickHandler(ev, ctx, spArray,som);
	}
}


//init: carregamento de componentes
function init(ctx,som)
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
	imgCar.id="car";
	imgCar.addEventListener("load", imgLoadedHandler);
	imgCar.src = "resources/car.png";  //dá ordem de carregamento da imagem
	
	var imgTurb = new Image();
	imgTurb.id="turbo";
	imgTurb.addEventListener("load",imgLoadedHandler);
	imgTurb.src="resources/turbo.png";

	canvas.addEventListener("mousedown",mouseDown);
	canvas.addEventListener("mouseup",mouseUp);
	canvas.addEventListener("mousemove",mouseHover);
	window.addEventListener("keyup",keyUp);
	window.addEventListener("keydown",keyDown);


	function imgLoadedHandler(ev)
	{
		switch (ev.target.id) {
			case "car":

				var img = ev.target;
				var nw = img.naturalWidth;
				var nh = img.naturalHeight;
				var sp = new SpriteImage(0, 0, Math.round(nw/4), Math.round(nh/4), 1, false, img,false);
				spArray[0] = sp;
				nLoad++;
				break;
			case "turbo":
				var img = ev.target;
				var nw = img.naturalWidth;
				var nh = img.naturalHeight;
				var sp = new SpriteImage(Math.round(canvas.width/2), 0, nw, nh, 1, false, img,true);
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

	function mouseDown(ev) {
		mouseDownEvent(ev,spArray[1]);
	}
	function mouseUp(ev){
		mouseUpEvent(ev,spArray[1]);
	}
	function mouseHover(ev) {
		mouseHoverEvent(ev,spArray[1])
	}
	function keyUp(ev){
		keyUpEvent(ev,spArray[1]);
	}

	function keyDown(ev){
		keyDownEvent(ev,spArray[1]);
	}


}


//iniciar animação
function startAnim(ctx, spArray,som)		//primeira chamada 
{
	
	draw(ctx, spArray);
	animLoop(ctx, spArray,0,0,som);
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
function animLoop(ctx, spArray,startTime,time,som)		//funcao intermediaria que chama o render
{
	
	var al = function(time)
	{	
		if(startTime==0){
			startTime=time;
		}
		
		animLoop(ctx, spArray,startTime,time,som);
	}

	var reqID = window.requestAnimationFrame(al);

	render(ctx, spArray, reqID,time-startTime,som);
	
}

//resedenho, actualizações, ...funcao chamada para 60fps, atualiza as posicoes,o texto, tempo, clear a canvas e volta a desenhar
function render(ctx, spArray, reqID, dt,som)
{	
	var cw = ctx.canvas.width;
	var ch = ctx.canvas.height;

	//animar sprites
	var sp = spArray[0];
	var turbo=spArray[1];

	//verificar se turbo toca no carro e aumentar velocidade do carro
	if(sp.checkCollision(ctx,sp,turbo)==true){  
		sp.speed+=2;
		som.play();

		turbo.clear(ctx);
		turbo.x =cw/2;
		turbo.y = ch/2;
		turbo.draw(ctx);
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
		turbo.clickable = true;
	}
	

	
	if(turbo.up && turbo.y>0){
		turbo.y -=turbo.speed
	}
	if(turbo.down && turbo.y + turbo.height<ch){
		turbo.y += turbo.speed
	}
	

	if(turbo.left && turbo.x> 0){
		turbo.x -= turbo.speed
	}
	if(turbo.right && turbo.x + turbo.width<cw){
		turbo.x += turbo.speed
	}




	//redesenhar sprites e texto
	var txt = "Time: " + Math.round(dt) + " msec";
	ctx.fillText(txt, cw/2, ch);
	draw(ctx, spArray);
}


//-------------------------------------------------------------
//--- interacção com o rato
//-------------------------------------------------------------
function canvasClickHandler(ev, ctx, spArray,som)
{	
	if (spArray[0].clickedBoundingBox(ev) || spArray[1].clickedBoundingBox(ev))
	{	
		
		spArray[0].reset(ev, ctx);
		spArray[1].reset(ev,ctx);
		animLoop(ctx, spArray,0,0,som);
		
	}
}



function mouseDownEvent(ev,sp){
	if(sp.draggable && sp.mouseOverBoundingBox(ev)){
		sp.mouseDown = true
		sp.offsetX = ev.offsetX - sp.x;  //mx, my = mouseX, mouseY na canvas
		sp.offsetY = ev.offsetY - sp.y;
		
	}
}


function mouseUpEvent(ev,sp){
	if(sp.draggable && sp.mouseDown){
		sp.mouseDown = false;
	}
}

function mouseHoverEvent(ev,sp){
	if(sp.draggable && sp.mouseDown){
		sp.x = ev.offsetX - sp.offsetX;  //mx, my = mouseX, mouseY na canvas
		sp.y = ev.offsetY - sp.offsetY;
	}
}

function keyUpEvent(ev,sp) {
	switch (ev.code){
		case "ArrowUp":
			sp.up = false;
			break;
		case "ArrowDown":
			sp.down = false;
			break;
		case "ArrowLeft":
			sp.left = false;
			break;
		case "ArrowRight":
			sp.right = false;
			break;	
	}
	
}

function keyDownEvent(ev,sp){
	switch (ev.code){
		case "ArrowUp":
			sp.up = true;
			break;
		case "ArrowDown":
			sp.down = true;
			break;
		case "ArrowLeft":
			sp.left = true;
			break;
		case "ArrowRight":
			sp.right = true;
			break;	
	}

	
}