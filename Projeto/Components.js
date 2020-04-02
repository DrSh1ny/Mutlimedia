class Components
{
      constructor(x,y,height,width,src){
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            
            this.src = src
      }


      draw(ctx){
            ctx.drawImage(this.src,this.x,this.y,this.width,this.height)
      }

      clear(ctx)
	{
		ctx.clearRect(this.x, this.y, this.width, this.height);
	}


      destroy(ev, ctx){
            this.clear(ctx);
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
			console.log(this.y)
			return true;
		}
		else
			return false;

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
			console.log(this.y)
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
		
}

class ElementoEspecial extends Components{
      constructor(x,y,height,width,src,speedX,speedY){
            super(x,y,height,width,src)
            this.speedX = speedX
            this.speedY = speedY
      }

      mover(finalX,finalY,ctx){
            while(this.x != finalX && this.y != finalY){
                  this.x += this.speedX
                  this.y += this.speedY
                  super.clear(ctx)
                  super.draw(ctx)
            }
      }
}

class End extends Components{
      constructor(x,y,height,width,src){
            super(x,y,height,width,src)
      }


      reaction(ctx,sprite1,sprite2){
            if(super.checkCollision(ctx,sprite1,sprite2)){
                  return true
            }

            return false
      }

}

class Wall extends Components{
      constructor(x,y,height,width,src){
            super(x,y,height,width,src)
      }

      reaction(ctx,sprite1,sprite2){
            if(super.checkCollision(ctx,sprite1,sprite2)){
                  return true
            }

            return false
      }

}


class Bot extends ElementoEspecial{
      constructor(x,y,height,width,src,speedX,speedY,vidas,reaction){
            super(x,y,height,width,src,speedX,speedY)
            this.vidas = vidas
            this.reaction = reaction
      }

      interaction(ctx,sprite1,sprite2){
            if(super.checkCollision(ctx,sprite1,sprite2)){
                  this.reaction()
                  this.vidas--
                  if(vidas <= 0){
                        super.clear(ctx)
                  }
            }
      }
}


class Caixas extends ElementoEspecial{
      constructor(x,y,height,width,src,speedX,speedY,vidas,reaction){
            super(x,y,height,width,src,speedX,speedY)
            this.reaction = reaction

      }

      interaction(ctx,sprite1,sprite2){
            if(super.checkCollision(ctx,sprite1,sprite2)){
                  this.reaction()
                  super.clear(ctx)
            }
      }

}