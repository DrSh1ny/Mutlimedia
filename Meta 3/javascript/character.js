"use strict"

class Character {

    constructor(posX, posY, width, height, img,assets,shooters,imagens,sons,nFrames,framePeriod,levelWidth,bulletImageLeft,bulletImageRight) {
        this.posX = posX;
        this.posY = posY;
        this.lastX= posX;
        this.lastY= posY;

        this.levelWidth=levelWidth; //keep player in game boudaries
        
        var canvas = document.getElementById("canvas");
        this.framerate=canvas.framerate;
        if(this.framerate==144){//144hz monitor

            this.speedX = 0;
            this.speedY = 0;
            this.acelX = 2;
            this.acelYUp = 0.2;
            this.acelYDown=0.5;
            this.frictionX=0.89;
            this.airFriction=0.96;
            this.speedLimitX=2;
            this.speedLimitY=30;
            this.boostX=30;
            this.boostY=8;
        }
        else{ //60hz monitor
            this.speedX = 0;
            this.speedY = 0;
            this.acelX = 4.8;
            this.acelYUp = 1.5;
            this.acelYDown=3.75;
            this.frictionX=0.84;
            this.airFriction=0.92;
            this.speedLimitX=4;
            this.speedLimitY=25;
            this.boostX=40;
            this.boostY=26;
        }

        this.width = width;
        this.height = height;

        this.left = false;
        this.right = false;
        this.up=false;
        this.grounded=false;

        this.lives=3;
        //projeteis lancados pela personagem
        this.shots = [];
        this.shotDelay = 500;//passar depois as bullets
        this.lastShot = 0;
        this.bulletsRange = 400;
        this.bulletImageLeft=bulletImageLeft;
        this.bulletImageRight=bulletImageRight;

        var self = this;
        this.imagens=imagens;
        this.sons=sons;
        this.assets=assets; //todos os assets do nivel e o proprio character em ultimo
        this.shooters=shooters;

        var keyDownHandler = function (ev) {
            self.keyDown(ev, self);
        }

        var keyUpHandler = function (ev) {
            self.keyUp(ev, self);
        }

        document.addEventListener("keydown", keyDownHandler);
        document.addEventListener("keyup", keyUpHandler);

        this.frame=0;       //para a animacao no this.render
        this.frameCount=0;  //para a animacao no this.render
        this.framePeriod=framePeriod;
        this.nFrames=nFrames;
        this.lastDirection="right";  //para a animacao no this.render
        
        this.img=img;
        this.imgData=this.getImageData(self.img);
        
        
    
        


    }

    render(ctx) {
        var row=this.getRow();
        var frameWidth=this.img.naturalWidth/this.nFrames; 
        var frameHeight=this.img.naturalHeight/6; //num de estados
        ctx.drawImage(this.img,this.frame*frameWidth,row*frameHeight,frameWidth,frameHeight, this.posX, this.posY, this.width, this.height);
        
        this.frameCount+=1;
        
        if(this.frameCount>this.framePeriod){
            this.frameCount=0;
            this.frame=(this.frame+1)%this.nFrames;
        }
        
    }



    getRow(){
        var row=0;

        if(this.lastDirection=="left"){
            row=3;
        }
        else{
            row=2;
        }
        if(Math.round(this.speedX)>0){
            row=0;
        }
        if(Math.round(this.speedX)<0){
            row=1;
        }
        if(!this.grounded){
            if(this.lastDirection=="left"){
                row=5;
            }
            else{
                row=4;
            }
        }

        return row;
    }

    getImageData(img) {

        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        var ctx = canvas.getContext("2d");
        var frameWidth=this.img.naturalWidth/this.nFrames; 
        var frameHeight=this.img.naturalHeight/6; //num de estados
        var arrayImgData=[];
        
        for(let y=0;y<6;y++){
            for(let x=0;x<this.nFrames;x++){
                //limpar tela
                ctx.clearRect(0,0,this.width,this.height);
                //desenhar frame
                ctx.drawImage(img,x*frameWidth,y*frameHeight,frameWidth,frameHeight,0,0, this.width, this.height);
                //captar array de pixeis
                var frame=ctx.getImageData(0,0,this.width,this.height);
                //colocar frame no array principal
                arrayImgData.push(frame);
            }
        }
        return arrayImgData;
    }

    


    move(character,timePassed,ctx) {
        character.lastX=character.posX;
        character.lastY=character.posY;

       
        var acelY=character.acelYDown;
        var acelX=character.acelX;
        var friction=character.frictionX;
        
        if(character.speedY<0){
            acelY=character.acelYUp;
        }
    

        //left
        if(character.left && !character.right){
            acelX=-character.acelX;
            character.speedX-=character.boostX;
            friction=1;
        }
        //right
        if(character.right && !character.left){
            acelX=character.acelX;
            character.speedX+=character.boostX;
            friction=1;
        }
        //up
        if(character.up && character.grounded){
            character.speedY+=-character.boostY;
            character.grounded=false;
            
        }
        //no key
        if(!character.right && !character.left){
            if(character.grounded){
                friction=character.frictionX;
            }
            else{
                friction=character.airFriction;
            }
            character.acelX=0;
        }

        character.speedY+=acelY;
        character.speedX=(character.speedX+character.acelX)*friction;

        //speed limit
        if(character.speedX>character.speedLimitX){
            character.speedX=character.speedLimitX;
        }
        if(character.speedX<-character.speedLimitX){
            character.speedX=-character.speedLimitX;
        }
        if(character.speedY>character.speedLimitY){
            character.speedY=character.speedLimitY;
        }
        if(character.speedY<-character.speedLimitY){
            character.speedY=-character.speedLimitY;
        }

        //map boudaries
        if(character.posX<0){
            character.posX=0;
        }
        if(character.posX+character.width>character.levelWidth){
            character.posX=character.levelWidth-character.width;
        }
        
        
        //move
        character.posX+=character.speedX;
        character.posY+=character.speedY;
        character.handleCollision(character);
        
        
    }


    handleCollision(character){
        
        for(let i=0;i<character.assets.length-1;i++){
            var asset=character.assets[i]
            var collision=character.checkPixelCollision(character,asset);

            if(collision=="vertical" ){
                if(character.posY<asset.posY){
                    character.posY=asset.posY-character.height;
                    character.speedY=0;
                    character.grounded=true;
                   
                }
                else{
                    character.posY>=asset.posY+asset.height;
                    character.speedY=0;
                }
            }
            
            else if(collision=="horizontal"){
                if(character.posX+character.width/2>asset.posX+asset.width/2 && character.speedX<0){
                    character.posX-=character.speedX;
                }
                else if(character.posX+character.width/2<asset.posX+asset.width/2 && character.speedX>0){
                    character.posX-=character.speedX;
                }
                
            }
                
                
        }

        for(let i=0;i<character.shooters.length;i++){
            var shooter=character.shooters[i]
            var collision=character.checkPixelCollision(character,shooter);

            if(collision=="vertical" ){
                if(character.posY<shooter.posY){
                    character.posY=shooter.posY-character.height;
                    character.speedY=0;
                    character.grounded=true;
                    
                }
                else{
                    character.posY=shooter.posY+shooter.height;
                    character.speedY=0;
                }
            }
            
            else if(collision=="horizontal"){
                if(character.posX+character.width/2>shooter.posX+shooter.width/2 && character.speedX<0){
                    character.posX-=character.speedX;
                }
                else if(character.posX+character.width/2<shooter.posX+shooter.width/2 && character.speedX>0){
                    character.posX-=character.speedX;
                }
                
            }
                
                
        }

    }

    

    

    keyDown(ev, character) {
        var canvas=document.getElementById("canvas");
        
        if (ev.code == canvas.keys.right) {
            character.right = true;
            character.lastDirection="right";
        }

        if (ev.code == canvas.keys.left) {
            character.left = true;
            character.lastDirection="left";
        }

        if (ev.code == canvas.keys.jump) {
            character.up = true;
        }
    }

    keyUp(ev, character) {
        var canvas=document.getElementById("canvas");
        if (ev.code == canvas.keys.right) {
            character.right = false;
        }

        if (ev.code == canvas.keys.left) {
            character.left = false;  
        }

        if (ev.code == canvas.keys.jump) {
            character.up = false;
        }

        if (ev.code == canvas.keys.attack){
            //por causa de diferentes framrates
            var fator=1;
            if(canvas.framerate==60){
                fator=2.4;
            }
            //se der para disparar cria o projetil
            var d = new Date();
            var time = d.getTime();
            if(time - this.lastShot > this.shotDelay){//o primeiro disparo vai ser sempre permitido visto que o this.lasShot = 0, depois deste, este valor e atualizado e a partir dai so se dispara, no minimo em intervalos de this.shotDelay
              if(this.lastDirection=="right"){
                var shot = new Bullet(this.posX+this.width/2,this.posY+this.height/4,this.bulletImageRight.naturalWidth,this.bulletImageRight.naturalHeight,this.bulletImageRight,5*fator,0,this) //colocar os parametros para a criacao do projetil
              }
              else{
                var shot = new Bullet(this.posX-this.width/2,this.posY+this.height/4,this.bulletImageLeft.naturalWidth,this.bulletImageLeft.naturalHeight,this.bulletImageLeft,-5*fator,0,this) //colocar os parametros para a criacao do projetil
              }
              character.shots.push(shot);
              this.lastShot = time;
              this.sons.sword2.play();
            }
          }

    }

    getBox(){
        return [this.posX,this.posY,this.posX+this.width,this.posY+this.height] //left top right bottom
    }

    

    checkPixelCollision(sprite1,sprite2){ //character-Componente  for character phisics
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
                        if(yMax-yMin<xMax-xMin){
                            return "vertical"
                        }
                        else{
                            return "horizontal"
                        }
                        
                    }
                    
				}
            }
            return false;
        }
		else{
			return false;
		}
			
	}


    checkPixelCollisionSpriteAnimated(sprite1,sprite2){  //character-animated Componente
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
        var atualB=0;
        var array1=[];
        var array2=[];
        
        if (leftA < rightB && rightA > leftB && topA< botB && botA > topB) {
        row=sprite1.getRow();
        frame=sprite1.frame;
        atual=row*4+frame;
        atualB=sprite2.currentFrame;
        array1=sprite1.imgData[atual].data;
        array2=sprite2.imgData[atualB].data;

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
}