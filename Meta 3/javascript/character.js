"use strict"

class Character {

    constructor(posX, posY, width, height, img,assets) {
        this.posX = posX;
        this.posY = posY;
        this.lastX= posX;
        this.lastY= posY;

        this.speedX = 0;
        this.speedY = 0;
        this.acelX = 0;
        this.acelY = 0.2;
        this.frictionX=0.92;
    
        this.speedLimitX=2;
        this.speedLimitY=30;
        this.boostX=30;
        this.boostY=8;

        this.width = width;
        this.height = height;

        this.left = false;
        this.right = false;
        this.up=false;
        this.grounded=false;

        var self = this;
        this.assets=assets; //todos os assets do nivel e o proprio character em ultimo

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
        this.lastDirection="right";  //para a animacao no this.render
        
        this.img=img;
        this.imgData=this.getImageData(self.img);
        
        
    
        


    }

    render(ctx) {
        var row=this.getRow();

        ctx.drawImage(this.img,this.frame*64,row*92,64,92, this.posX, this.posY, this.width, this.height);
        
        this.frameCount+=1;
        if(this.frameCount>20){
            this.frameCount=0;
            this.frame=(this.frame+1)%4;
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
        
        var arrayImgData=[];
        
        for(let y=0;y<6;y++){
            for(let x=0;x<4;x++){
                //limpar tela
                ctx.clearRect(0,0,this.width,this.height);
                //desenhar frame
                ctx.drawImage(img,x*64,y*92,64,92,0,0, this.width, this.height);
                //captar array de pixeis
                var frame=ctx.getImageData(0,0,this.width,this.height);
                //colocar frame no array principal
                arrayImgData.push(frame);
            }
        }
        return arrayImgData;
    }

    


    move(character, lastFrame, currentFrame,ctx) {
        character.lastX=character.posX;
        character.lastY=character.posY;

        var secondsPassed=(currentFrame-lastFrame)/1000;
        
        
        if(character.speedY>0){
            character.acelY=0.5;
        }
        else{
            character.acelY=0.2;
        }

        //left
        if(character.left && !character.right){
            character.acelX=-2*secondsPassed;
            character.speedX-=character.boostX*secondsPassed;
            character.frictionX=1;
        }
        //right
        if(character.right && !character.left){
            character.acelX=2*secondsPassed;
            character.speedX+=character.boostX*secondsPassed;
            character.frictionX=1;
        }
        //up
        if(character.up && character.grounded){
            character.speedY+=-character.boostY;
            character.grounded=false;

        }
        //no key
        if(!character.right && !character.left){
            if(character.grounded){
                character.frictionX=0.92;
            }
            else{
                character.frictionX=1;
            }
            character.acelX=0;
        }

        character.speedY+=character.acelY;
        character.speedX=(character.speedX+character.acelX)*character.frictionX;

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


        //move
        character.posX+=character.speedX;
        character.posY+=character.speedY;
        character.handleCollision(character);
        
        
    }


    handleCollision(character){
        // o ultimo asset é o proprio character, nao e testada a colisao ai
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
                    character.posY=asset.posY+asset.height;
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

    }

    

    

    keyDown(ev, character) {
        if (ev.key == "ArrowRight") {
            character.right = true;
            character.lastDirection="right";
        }

        if (ev.key == "ArrowLeft") {
            character.left = true;
            character.lastDirection="left";
        }

        if (ev.code == "Space") {
            character.up = true;
        }
    }

    keyUp(ev, character) {
        if (ev.key == "ArrowRight") {
            character.right = false;
        }

        if (ev.key == "ArrowLeft") {
            character.left = false;  
        }

        if (ev.code == "Space") {
            character.up = false;
        }

    }

    getBox(){
        return [this.posX,this.posY,this.posX+this.width,this.posY+this.height] //left top right bottom
    }

    checkBoxCollision(sprite1,sprite2){
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
        

		
		if (leftA < rightB && rightA > leftB && topA< botB && botA > topB) {

            var xMin=Math.max(sprite1.posX,sprite2.posX);
			var yMin=Math.max(sprite1.posY,sprite2.posY);
			var xMax=Math.min(sprite1.posX+sprite1.width,sprite2.posX+sprite2.width);
            var yMax=Math.min(sprite1.posY+sprite1.height,sprite2.posY+sprite2.height);
            
            if(yMax-yMin<xMax-xMin){
                return "vertical"
            }
            else{
                return "horizontal"
            }

        }

        else{
            return false;
        }

    }

    checkPixelCollision(sprite1,sprite2){
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

					if(array1[yLocalA*sprite1.width*4 + xLocalA*4 +3]!=0){
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

}