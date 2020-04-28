"use strict"

class Component{
    
    constructor(posX,posY,width,height,img,secondImage=null){
        this.posX = posX;
        this.posY = posY;
        this.xIni=posX;
        this.yIni=posY;

        this.width = width;
        this.height = height;
        
        
        this.img=img;

        //para os componentes do menu aquando da passagem do rato
        this.secondImage=secondImage;
        this.hover=false;

        this.imgData=this.getImageData(this.img);

        
    }

    render(ctx) {
          if(this.hover && this.secondImage!=null){//rato em cima do componente
            ctx.drawImage(this.secondImage,this.posX,this.posY, this.width, this.height);
          }
          else{
            ctx.drawImage(this.img,this.posX,this.posY, this.width, this.height);
          }
    }

    getImageData(img) {

        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        var ctx = canvas.getContext("2d");

        ctx.drawImage(img,0, 0, this.width, this.height);
        return ctx.getImageData(0, 0, this.width, this.height);
    }

    getBox(){
        return [this.posX,this.posY,this.posX+this.width,this.posY+this.height] //left top right bottom
    }

    mouseOverBoundingBox(ev) //ev.target é a canvas
	{
		var mx = ev.offsetX;  //mx, my = mouseX, mouseY na canvas
		var my = ev.offsetY;
		if (mx >= this.posX && mx <= this.posX + this.width && my >= this.posY && my <= this.posY + this.height)
			return true;
		else
			return false;
	}

    reset(ev, ctx)
	{
		this.clear(ctx);
		this.posX = this.xIni;
		this.posX = this.yIni;
      }


}


class SpecialElement extends Component{
	constructor(x, y, w, h, speedX,speedy, img,finalX,finalY){
		super(x, y, w, h, speedX,speedy, img);
		this.finalX = finalX;
		this.finalY = finalY;
	}
}

class End extends Component{
	constructor(x, y, w, h, speedX,speedy, img){
		super(x, y, w, h, speedX,speedy, img);
	}

	reaction(ctx,sprite1,sprite2){
		if(super.checkCollision(ctx,sprite1,sprite2)){
			return true
		}

		return false
	}
}

class Wall extends Component{
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

class Bot extends SpecialElement{
      constructor(x,y,height,width,src,speedX,speedY,finalX,finalY,vidas,reaction){
            super(x,y,height,width,src,speedX,speedY,finalX,finalY)
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

class Caixas extends SpecialElement{
      constructor(x,y,height,width,src,speedX,speedY,reaction){
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