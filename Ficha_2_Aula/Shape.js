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
		super(x,y);
		this.larg=larg;
		this.comp=comp;


	}

	draw(cor,ctx)
	{

		ctx.fillStyle = cor;
		ctx.fillRect(this.x, this.y, this.comp, this.larg);
	}

	hitbox(){
		return [this.x,this.x+this.comp,this.y,this.y+this.larg]; //left right top bot
	}
}


class Circle extends Shape
{

	constructor(x,y,raio)
	{
		super(x,y);
		this.raio=raio;




	}

	draw(cor,ctx)
	{


		ctx.beginPath();
    ctx.arc(this.x, this.y, this.raio, 0, 2 * Math.PI, false);
    ctx.fillStyle = cor;
    ctx.fill();
	}

	hitbox(){
		return [this.x-this.raio,this.x+this.raio,this.y-this.raio,this.y+this.raio]; //left right top bot

	}

}
