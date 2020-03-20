"use strict";

class SpriteImage
{
	constructor(x, y, w, h, speed, clickable, img)
	{
		//posição e movimento
		this.xIni = x;
		this.yIni = y;
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.speedIni= speed;
		this.speed = speed;

		//imagem
		this.img = img;

		//rato
		this.clickableIni = clickable;
		this.clickable = clickable;
	}


	draw(ctx)
	{
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	}


	clear(ctx)
	{
		ctx.clearRect(this.x, this.y, this.width, this.height);
	}


	reset(ev, ctx)
	{
		this.clear(ctx);
		this.x = this.xIni;
		this.y = this.yIni;
		this.clickable = this.clickableIni;

	}


	mouseOverBoundingBox(ev) //ev.target é a canvas
	{
		var mx = ev.offsetX;  //mx, my = mouseX, mouseY na canvas
		var my = ev.offsetY;

		if (mx >= this.x && mx <= this.x + this.width && my >= this.y && my <= this.y + this.height)
			return this.collisionPixel(ev,this.img);
		else
			return false;
	}

	getImageData(img){
		img.setAttribute('crossOrigin', '');
		var canvas=document.createElement("canvas");
		canvas.width=this.width;
		canvas.height=this.height;
		var ctx=canvas.getContext("2d");
		ctx.drawImage(img,0,0,this.width,this.height);
		return ctx.getImageData(0,0,this.width,this.height);
	}

	collisionPixel(ev,img){
		//posicao do rato
		var ratoX=ev.offsetX;
		var ratoY=ev.offsetY;
		
		var array=this.getImageData(img);
		//se a posicao do rato for diferente de zero no array entao houve colisao
		var xLocal=ratoX-this.x;
		var yLocal=ratoY-this.y;
		
		//achar linha e depois coluna
		var pos=yLocal*this.width*4 + xLocal*4
		if (array[pos+3]!=0){
			//colisao das caixas detetada
			//check pixels
			return true
		}
		else
			return false;

	}


	clickedBoundingBox(ev) //ev.target é a canvas
	{
		if (!this.clickable)
			return false;
		else
			return this.mouseOverBoundingBox(ev);
	}
}
