"use strict";

class SpriteImage
{
	constructor(x, y, w, h, speed, clickable, img, draggable)
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
		this.offsetX = 0;
		this.offsetY = 0;
		//imagem
		this.img = img;
		this.array=this.getImageData(this.img);

		//rato
		this.clickableIni = clickable;
		this.clickable = clickable;

		this.mouseDown = false;
		this.draggable = draggable;

		this.up = false;
		this.down = false;
		this.left = false;
		this.right = false;

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
		this.speed=this.speedIni;
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

		// IMPORTANTE 
		//tem de se executar o browser com a flag --allow-file-access-from-files tipo 
		//"Chrome.exe --allow-file-access-from-files"
		//caso contrário o browser nao deixa executar funcao por seguranca
		//confirmado pelo professor
		
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
		
		var data=this.array;
		var array=data.data;

		//se a posicao do rato for diferente de zero no array entao houve colisao
		var xLocal=ratoX-this.x;
		var yLocal=ratoY-this.y;
		
		
		//achar linha e depois coluna
		var pos=Math.round(yLocal)*Math.round(this.width)*4;
		pos+=Math.round(xLocal)*4;  //posicao do rato no array
		
		
		if (array[pos+3]!=0){
			//colisao das caixas detetada
			//check pixels
			return true;
		}
		else
			return false;

	}
	

	checkCollision(ctx,sprite1,sprite2){
		//verificar box de colisao
		var topA=sprite1.y;
		var topB=sprite2.y;
		var leftA=sprite1.x;
		var leftB=sprite2.x;
		var botA=topA+sprite1.height;
		var botB=topB+sprite2.height;
		var rightA=leftA+sprite1.width;
		var rightB=leftB+sprite2.width;

		
		if (leftA < rightB && rightA > leftB && topA< botB && botA > topB) {
			
			
			//arrays com os pixeis de cada sprite
			var pixeisA=sprite1.array.data;
			var pixeisB=sprite2.array.data;

			
			var xMin=Math.max(sprite1.x,sprite2.x);
			var yMin=Math.max(sprite1.y,sprite2.y);
			var xMax=Math.min(sprite1.x+sprite1.width,sprite2.x+sprite2.width);
			var yMax=Math.min(sprite1.y+sprite1.height,sprite2.y+sprite2.height);

			for(let y=yMin;y<yMax;y++){
				for(let x=xMin;x<xMax;x++){
					


					let xLocalA= x-leftA;
					let yLocalA= y-topA;

					let xLocalB= x-leftB;
					let yLocalB= y-topB;

					if(pixeisA[yLocalA*sprite1.width*4 + xLocalA*4 +3]!=0 && pixeisB[yLocalB*sprite2.width*4 + xLocalB*4 +3]!=0){
						return true;
					}
				}
			}
			return false;
		}
		else{
			return false;
		}
			
	}


	clickedBoundingBox(ev) //ev.target é a canvas
	{
		if (!this.clickable)
			return false;
		else
			return this.mouseOverBoundingBox(ev);
	}
}
