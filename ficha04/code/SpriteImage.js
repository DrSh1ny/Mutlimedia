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
		
		var data=this.getImageData(img);
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
	getImageDataTwo(ctxOld,sprite1,sprite2){
		// IMPORTANTE 
		//tem de se executar o browser com a flag --allow-file-access-from-files tipo 
		//"Chrome.exe --allow-file-access-from-files"
		//caso contrário o browser nao deixa executar funcao por seguranca
		//confirmado pelo professor


		//calcular posicao do retangulo de intersecao
		var x=Math.round(Math.max(sprite1.x,sprite2.x));
		var y=Math.round(Math.max(sprite1.y,sprite2.y));
		var x1=Math.round(Math.min(sprite1.x+sprite1.width,sprite2.x+sprite2.width));
		var y1=Math.round(Math.min(sprite1.y+sprite1.height,sprite2.y+sprite2.height));
		var colWidth=x1-x;
		var colHeight=y1-y;

		//pos do retangulo retalivo ao sprite 1
		var xA=x-sprite1.x
		var xB=x-sprite2.x

		//pos do retangulo retalivo ao sprite 2
		var yA=y-sprite1.y
		var yB=y-sprite2.y

		var canvas=document.createElement("canvas");
		canvas.width=colWidth;
		canvas.height=colHeight;
		var ctx=canvas.getContext("2d");
		//tirar array do retangulo no sprite 1
		ctx.drawImage(sprite1.img,xA,yA,colWidth,colHeight,0,0,colWidth,colHeight);
		var array1=ctx.getImageData(0,0,colWidth,colHeight);
		ctx.clearRect(0,0,colWidth,colHeight);
		
		//tirar array do retangulo no sprite 2
		ctx.drawImage(sprite2.img,xB,yB,colWidth,colHeight,0,0,colWidth,colHeight);
		var array2=ctx.getImageData(0,0,colWidth,colHeight);
	
		return [array1,array2];
	}

	checkCollision(ctxOld,sprite1,sprite2){
		//verificar box de colisao
		var topA=sprite1.y;
		var topB=sprite2.y;
		var leftA=sprite1.x;
		var leftB=sprite2.x;
		var botA=topA+sprite1.height;
		var botB=topB+sprite2.height;
		var rightA=leftA+sprite1.width;
		var rightB=leftB+sprite2.width;

		if((rightA>leftB) && (leftA<rightB) && (botA>topB) && (topA<botB)){
			
			
			var pixies=this.getImageDataTwo(ctxOld,sprite1,sprite2);
			//arrays com os pixeis da colisao
			var array1=pixies[0].data;
			var array2=pixies[1].data;
			var comp=array1.length;
			
			for(let i=0; i<comp;i+=4){
				
				if(array1[i+3]!=0 && array2[i+3]!=0){
					return true;
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
