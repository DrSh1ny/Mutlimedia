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

      checkPixelCollisionCharacter(sprite1,sprite2){     //character-Componente
            //calcular box de colisao
            var box1=sprite1.getBox();
            var box2=sprite2.getBox();

            var topA=box1[1];
            var topB=box2[1];
            var leftA=box1[0];
            var leftB=box2[0];
            var botA=box1[3];
            var botB=box2[3];
            var rightA=box1[2];
            var rightB=box2[2];

            //para recolher array de pixeis do frame atual
            var row=0;
            var frame=0;
            var atual=0;
            
            var array1=[];
            var array2=[];
            
            if (leftA < rightB && rightA > leftB && topA< botB && botA > topB) {
            row=sprite1.getRow();
            frame=sprite1.frame;
            atual=row*4+frame;
            
            array1=sprite1.imgData[atual].data;
            array2=sprite2.imgData.data;

            var xMin=Math.max(sprite1.posX,sprite2.posX);
                  var yMin=Math.max(sprite1.posY,sprite2.posY);
                  var xMax=Math.min(sprite1.posX+sprite1.width,sprite2.posX+sprite2.width);
                  var yMax=Math.min(sprite1.posY+sprite1.height,sprite2.posY+sprite2.height);

            for(let y=yMin;y<yMax;y++){
                  for(let x=xMin;x<xMax;x++){
                              
                        let xLocalA= Math.floor(x-leftA);
                        let yLocalA= Math.floor(y-topA);

                        let xLocalB= Math.floor(x-leftB);
                        let yLocalB= Math.floor(y-topB);

                        if(array1[yLocalA*sprite1.width*4 + xLocalA*4 +3]!=0 && array2[yLocalB*sprite2.width*4 + xLocalB*4 +3]!=0){
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

      checkPixelCollisionComponent(sprite1,sprite2){     //Componente-Componente
            //calcular box de colisao
            var box1=sprite1.getBox();
            var box2=sprite2.getBox();

            var topA=box1[1];
            var topB=box2[1];
            var leftA=box1[0];
            var leftB=box2[0];
            var botA=box1[3];
            var botB=box2[3];
            var rightA=box1[2];
            var rightB=box2[2];

            //para recolher array de pixeis do frame atual
            var row=0;
            var frame=0;
            var atual=0;
            
            var array1=[];
            var array2=[];
            
            if (leftA < rightB && rightA > leftB && topA< botB && botA > topB) {
            array1=sprite1.imgData.data;
            array2=sprite2.imgData.data;

            var xMin=Math.max(sprite1.posX,sprite2.posX);
            var yMin=Math.max(sprite1.posY,sprite2.posY);
            var xMax=Math.min(sprite1.posX+sprite1.width,sprite2.posX+sprite2.width);
            var yMax=Math.min(sprite1.posY+sprite1.height,sprite2.posY+sprite2.height);

            for(let y=yMin;y<yMax;y++){
                  for(let x=xMin;x<xMax;x++){
                              
                        let xLocalA= Math.floor(x-leftA);
                        let yLocalA= Math.floor(y-topA);

                        let xLocalB= Math.floor(x-leftB);
                        let yLocalB= Math.floor(y-topB);

                        if(array1[yLocalA*sprite1.width*4 + xLocalA*4 +3]!=0 && array2[yLocalB*sprite2.width*4 + xLocalB*4 +3]!=0){
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


    reset(ev, ctx)
	{
		this.clear(ctx);
		this.posX = this.xIni;
		this.posX = this.yIni;
      }


}



class ComponentAnimated extends Component{
      constructor(posX,posY,width,height,img,periodBetweenFrames,numberFrames,initialFrame){
            super(posX,posY,width,height,img,null);
            this.period=periodBetweenFrames;
            this.numberFrames=numberFrames;
            this.frameCount=0;
            this.currentFrame=initialFrame;
            this.imgData=this.getImageData(this.img);
      }

      render(ctx){
            var frameWidth=this.img.naturalWidth/this.numberFrames;
            var currentPos=frameWidth*this.currentFrame;

            ctx.drawImage(this.img,currentPos,0,frameWidth,this.img.naturalHeight,this.posX,this.posY,this.width,this.height);
            this.frameCount++;

            if(this.frameCount>this.period){
                  this.currentFrame= (this.currentFrame+1)%this.numberFrames;
                  this.frameCount=0;
            }
            
      }

      getImageData(img) {

            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            var ctx = canvas.getContext("2d");
            
            var arrayImgData=[];
            var frameWidth=this.img.naturalWidth/this.numberFrames;
            
            
            for(let x=0;x<this.numberFrames;x++){
                  //limpar tela
                  ctx.clearRect(0,0,this.width,this.height);
                  //desenhar frame
                  ctx.drawImage(img,x*frameWidth,0,img.naturalWidth,img.naturalHeight,0,0,this.width,this.height);
                  //captar array de pixeis
                  var frame=ctx.getImageData(0,0,this.width,this.height);
                  //colocar frame no array principal
                  arrayImgData.push(frame);
            }
            
            return arrayImgData;
      }

      

}

class Shooter extends Component{
      constructor(posX,posY,width,heigth,img,periodBetweenBullets,bulletVelocityX,bulletVelocityY,bulletWidth,bulletHeigth,bulletImg){
            super(posX,posY,width,heigth,img);
            
            //atributes of shooter's bullets
            this.bulletPeriod=periodBetweenBullets;
            this.bulletVelocityX=bulletVelocityX;
            this.bulletVelocityY=bulletVelocityY;
            this.bulletWidth=bulletWidth;
            this.bulletHeigth=bulletHeigth;
            this.bulletImg=bulletImg;
           
            var wraper=[this.posX+24,this.posY-4,this.bulletWidth,this.bulletHeigth,this.bulletImg,this.bulletVelocityX,this.bulletVelocityY,this]; 
            this.id=window.setInterval(this.fireBullet,this.bulletPeriod,wraper);
      }

      fireBullet(wraper){
            var canvas = document.getElementById("canvas");
            var bullet=new Bullet(...wraper);
            var ev=new Event("bulletFired");

            ev.bullet=bullet;
            canvas.dispatchEvent(ev);
      }
}

class Bullet extends Component{
      constructor(posX,posY,width,heigth,img,velocityX,velocityY,parentShooter){
            super(posX,posY,width,heigth,img);

            this.shooter=parentShooter;
            this.velocityX=velocityX;
            this.velocityY=velocityY;
      }

      move(){
            this.posX+=this.velocityX;
            this.posY+=this.velocityY;
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