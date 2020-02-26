"use strict";

class Shape
{
	constructor(x, y) //define coordenadas da forma
	{
		this.x = x;
		this.y = y;
	}

	toString()
	{
		return "(" + this.x + ", " + this.y + ")";
	}
}

class Rectangle extends Shape
{

	constructor(x,y,larg,comp)
	{
		super(x,y)
		this.larg=larg;
		this.comp=comp;


		//for collision detection
		//computed prior to detection (not ideal, could be only if necessary)
		this.left=this.x;
		this.right=this.x+this.larg;
		this.top=this.y;
		this.bot=this.y+this.comp;
	}

	draw(cor)
	{
		var canvas = document.getElementById("myCanvas");
		var ctx = canvas.getContext("2d");

		ctx.fillStyle = cor;
		ctx.fillRect(this.x, this.y, this.comp, this.larg);
	}
}


class Circle extends Shape
{
	constructor(x,y,raio)
	{
		super(x,y)
		this.raio=raio;

		//for collision detection
		//computed prior to detection (not ideal, could be only if necessary)
		this.left=this.x-raio;
		this.right=this.x+this.raio;
		this.top=this.y-raio;
		this.bot=this.y+this.raio;
	}

	draw(cor)
	{
		var canvas = document.getElementById("myCanvas");
		var ctx = canvas.getContext("2d");

		ctx.beginPath();
    ctx.arc(this.x, this.y, this.raio, 0, 2 * Math.PI, false);
    ctx.fillStyle = cor;
    ctx.fill();
	}
}
