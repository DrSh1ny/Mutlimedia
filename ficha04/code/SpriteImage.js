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
			return true;
		else
			return false;
	}

	getImageData(img){
		var canvas=document.createElement("canvas");
		canvas.width=this.width;
		canvas.height=this.height;
		
		var ctx=canvas.getContext("2d");
		ctx.drawImage(img,0,0,this.width,this.height);
		return ctx.getImageData(0,0,this.width,this.height);
	}

	collisionPixel(img){
		var mx = img.x;
		var my = img.y;
		if (mx >= this.x && mx <= this.x + this.width && my >= this.y && my <= this.y + this.height){
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
