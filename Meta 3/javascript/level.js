'use strict';



class Level{

  constructor(imagens,sounds,width,height){
    this.charX;
    this.charY;

    this.width=width;
    this.height=height;

    this.sprites
    this.assets;
    this.assetsAnimated;
    this.shooters;

		this.imagens=imagens;
		this.sounds=sounds;
  }

  
  run(){
    var canvas=document.getElementById("canvas");
    var ctx=canvas.getContext("2d");
    var nw=canvas.width;
    var nh=canvas.height;
    var assets=this.assets; //todos os componenentes do nivel e o character incluido excluindo os shooters
    var assetsAnimated=this.assetsAnimated; //assets c/ animacoes
    var shooters=this.shooters; 
		var bullets=new Array();  //bullet containment
		
		var imagens=this.imagens;
    var sounds=this.sounds;
    var volumeInicial=sounds.levelSound2.volume;
		var levelSound=sounds.levelSound2;
    var elementos=menuNiveis(canvas,[],this.imagens); //para apresentar quando o nivel acabar
		var endPoint=this.endPoint;
		var self=this;
    var elementosNivel=new Array();
    //for character movement
    var id;
    var d = new Date();
    var lastFrame =d.getTime();

    var char=new Character(Number(this.charX),Number(this.charY),64,88,this.imagens.afonso1,assets,shooters,imagens,sounds);
    assets.push(char);

    //camera
    var camera=new Camera(0,0,800,450);
    //var camera=new Camera(0,0,1066,600);
    var mapa = {x:0, y:0, width:1600, height:900};

    var gamestate="run";

    canvas.addEventListener("bulletFired",bulletFiredHandler);
    document.addEventListener("keyup",keyUpLevelHandler);
    canvas.removeEventListener("click",canvas.eventListeners.click);
    canvas.removeEventListener("mousemove",canvas.eventListeners.mouseMove);
    canvas.addEventListener("click",clickLevelHandler);
    canvas.addEventListener("mousemove",mouseMoveLevelHandler);


   
    levelSound.volume*=0.3;
    sounds.gun.volume*=0.1;
    levelSound.play();
    
    render();
    
    
    function render(time){
      if(gamestate=="end" || self.evaluateEnding(char,assets,assetsAnimated,bullets,endPoint,mapa)){ //evaluate ending conditions
        self.clearLevel(canvas,assets,assetsAnimated,shooters,bullets,bulletFiredHandler,keyUpLevelHandler,sounds,imagens,id,elementos,levelSound,volumeInicial);
      }
      else if(gamestate=="restart"){
        self.clearLevel(canvas,assets,assetsAnimated,shooters,bullets,bulletFiredHandler,keyUpLevelHandler,sounds,imagens,id,elementos,levelSound);
        mainAntigo(imagens,sounds);
      }
      else if(gamestate=="run"){     
        var timePassed=time-lastFrame;

        self.shotsHandler(char,assets,shooters);
        self.bulletHandler(char,bullets,assets,shooters);
        self.soundHandler(char,assets,assetsAnimated,shooters,endPoint,sounds,levelSound);
        //character movement
        char.move(char,timePassed,ctx);
        //rendering of everything
        camera.updateAnim(imagens,char,assets,assetsAnimated,shooters,bullets,mapa,ctx);
        camera.drawHUD(ctx,char,imagens);
        
        lastFrame=time;//for move function
        id=requestAnimationFrame(render);
      }
      else if(gamestate=="pause"){
        camera.drawPauseMenu(imagens,char,assets,assetsAnimated,shooters,bullets,mapa,ctx,elementosNivel);
        id=requestAnimationFrame(render);
      }
			
		}
    
    function clickLevelHandler(ev){
        gamestate=self.clickLevelHandlerOuter(ev,ctx,elementosNivel,imagens,gamestate);
        return;}
    function mouseMoveLevelHandler(ev){
        self.mouseLevelHandlerOuter(ev,ctx,elementosNivel,imagens);
        return;}
    function keyUpLevelHandler(ev){
      var resultado=self.keyUpLevelHandlerOuter(ev,gamestate,imagens,elementosNivel);
        gamestate=resultado[0];
        elementosNivel=resultado[1];
      return;}
      
    function bulletFiredHandler(ev){
			var newBullet=self.bulletFiredHandlerOuter(ev,sounds,char);
      bullets.push(newBullet);
    }

    
    return elementos;
  }
  

  clickLevelHandlerOuter(ev,ctx,elementos,imagens,gamestate){
    for(let i=0;i<elementos.length;i++){
      if (elementos[i].mouseOverBoundingBox(ev)){
        switch (elementos[i].img.id) {
          case "sair":
            return "end";
          case "reiniciar":
            return "restart";
          default:
            return gamestate;
        }
      }
    }
    return gamestate;
  }
  
  mouseLevelHandlerOuter(ev,ctx,elementos,imagens){
    var x=ev.offsetX;
    var y=ev.offsetY;
    
    for(let i=0;i<elementos.length;i++){
        if (elementos[i].mouseOverBoundingBox(ev)){
            canvas.style.cursor = "pointer";
            elementos[i].hover=true;
            return;

        }
        elementos[i].hover=false;

    drawElements(ctx,elementos,imagens);
    canvas.style.cursor = "default";

    }

  }

  clearLevel(canvas,assets,assetsAnimated,shooters,bullets,bulletFiredHandler,keyUpLevelHandler,sounds,imagens,id,elementos,levelSound,volumeInicial){
    var ctx=canvas.getContext("2d");
    for(let i=0;i<shooters.length;i++){
      clearInterval(shooters[i].id);//stop bullet firing   
    }
    Object.keys(sounds).forEach(function(key,index) {
      sounds[key].volume=volumeInicial;
    });
    document.removeEventListener("keyup",keyUpLevelHandler);
    canvas.removeEventListener("bulletFired",bulletFiredHandler); //stop bullet firing listener
    canvas.addEventListener("click",canvas.eventListeners.click);
    canvas.addEventListener("mousemove",canvas.eventListeners.mouseMove);
    drawElements(ctx,elementos,imagens);	//draw end of level screen/menu
    levelSound.pause();
    levelSound.currentTime = 0;
    cancelAnimationFrame(id);	//stop rendering
  }
  
  keyUpLevelHandlerOuter(ev,gamestate,imagens,elementos){
    if(ev.code=="Escape"){
      if(gamestate=="run"){
        var elementos=new Array();
        var sair=new Component(500,450,imagens.sair.naturalWidth,imagens.sair.naturalHeight,imagens.sair,imagens.sairHover);
        var reiniciar=new Component(500,330,imagens.reiniciar.naturalWidth,imagens.reiniciar.naturalHeight,imagens.reiniciar,imagens.reiniciarHover);
        elementos.push(sair);
        elementos.push(reiniciar);
        return ["pause",elementos]

      }
      if(gamestate=="pause"){
        return ["run",[]]
      }
    }
    return [gamestate,elementos];
  }

  shotsHandler(char,assets,shooters) {
    for (let i=0;i<char.shots.length;i++){
      char.shots[i].posX+=char.shots[i].velocityX;
      char.shots[i].posY+=char.shots[i].velocityY;

      var range = char.bulletsRange;
      var distanceTraveled = Math.sqrt(Math.pow(Math.abs(char.shots[i].posX - char.shots[i].xIni), 2) + Math.pow(Math.abs(char.shots[i].posY - char.shots[i].yIni), 2));
      //para que nao se sobreponham a outros sprites (colocar um parametro na bala para saber se ja tocou em algum sprite, se sim, essa bala, mesmo que aqui não deve fazer nada, nem ser mostrada, nem dar dano)
      if(distanceTraveled > range){
        char.shots.shift();
        continue;
      }
      
      //se o projetil colidir com um asset
      for(let j=0;j<assets.length-1;j++){
        if(assets[j].checkPixelCollisionComponent(assets[j],char.shots[i])){
          char.shots.splice(i,1);
          return;
        }
      }
      //se o projetil colidir com um shooter --> remover shooter e cancelar o seu lancamento de projeteis
      for(let j=0;j<shooters.length;j++){
        if(shooters[j].checkPixelCollisionComponent(shooters[j],char.shots[i])){
          char.shots.splice(i,1);
          clearInterval(shooters[j].id);
          shooters.splice(j,1);
          return;
          }
        }

      }
    }
      
    

	//reach end | out of lives | out of level bounds 
	evaluateEnding(char,assets,assetsAnimated,bullets,endPoint,mapa){
		if(char.checkPixelCollisionSpriteAnimated(char,endPoint)){
			return true;
		}
    
    if(char.posY+char.height>=mapa.y+mapa.height){
      return true;
    }

		if(char.lives<1){
				return true;
			}

	}

	//some shooter fired a bullet
	bulletFiredHandlerOuter(ev,sons,char){
    var xDistance=Math.abs(char.posX-ev.bullet.posX);
		var yDistance=Math.abs(char.posY-ev.bullet.posY);
		var distance=Math.sqrt(Math.pow(xDistance,2)+Math.pow(yDistance,2));
		var final=1-(distance/1500);
    sons.gun.volume=sons.levelSound2.volume*final;
    sons.gun.play();
		return ev.bullet;
	}


  bulletHandler(char,bullets,assets,shooters){   //check collition of bullets
    
		for(let i=0;i<bullets.length;i++){
			bullets[i].move();

			if(bullets[i].checkPixelCollisionCharacter(char,bullets[i])){
				bullets.splice(i,1);
        char.lives--;
        continue;
      }
      
      for(let j=0;j<assets.length-1;j++){
        if(bullets[i].shooter!=assets[j] && assets[j].checkPixelCollisionComponent(assets[j],bullets[i])){
          bullets.splice(i,1);
          break;
        }
      }
      
    }

} 			
		
	soundHandler(char,assets,assetsAnimated,shooters,endPoint,sounds,levelSound){
		var xDistance=Math.abs(char.posX-endPoint.posX);
		var yDistance=Math.abs(char.posY-endPoint.posY);
		var distance=Math.sqrt(Math.pow(xDistance,2)+Math.pow(yDistance,2));
		var final=1-(distance/1500);
		 
		//levelSound.volume*=0.1; /*Math.sqrt(Math.pow(xDistance,2)+Math.pow(yDistance,2))/2000*/;
		
		
	}

  loadLevel(file_path){
    //get the data in the file in a string
    var text = this.read(file_path);
    
    
    //parse the string using JSON.parse()
    var obj = JSON.parse(text);
 
    //need to know framerate to set projectile and animation velocity 
    var canvas = document.getElementById("canvas");
    var fator=1;
    if(canvas.framerate==60){
      fator=2.4;
    }
    
    //assign the data to the respective atribute of the level
    this.charX = obj.properties[0].value;
    this.charY = obj.properties[1].value;
    this.sprites = obj.layers[0].data;

  
    //more can be added as long as the constructor and the level file are updated
    //translate the matrix into an array of components
    //divide level space into grids
    //calculate unit square width and height
    var squareWidth=this.width/1600;
    var squareHeight=this.height/900;

    this.assets=new Array();
    this.assetsAnimated=new Array();
    this.shooters=new Array();
  
    for(let x=0;x<1600;x++){
      for(let y=0;y<900;y++){
        var posX=x*squareWidth;
        var posY=y*squareHeight;
        
				var pos=y*1600 + x;
				
				if(this.sprites[pos]!=0){
					console.log(this.sprites[pos]);
					
				}
        switch (this.sprites[pos]) {
          case 2: //caixa1
            var asset=new Component(posX,posY-this.imagens.box1.naturalHeight,this.imagens.box1.naturalWidth,this.imagens.box1.naturalHeight,this.imagens.box1);
            this.assets.push(asset);
            break;
           
          case 3: //caixa2
            var asset=new Component(posX,posY,this.imagens.box2.naturalWidth,this.imagens.box2.naturalHeight,this.imagens.box2);
            this.assets.push(asset);
            break;
            
          case 1: //plataforma
            var asset=new Component(posX,posY-this.imagens.plataforma.naturalHeight,this.imagens.plataforma.naturalWidth,this.imagens.plataforma.naturalHeight,this.imagens.plataforma);
            this.assets.push(asset);
            break;
            
          case 11: //endPoint (star)
            var endPoint=new ComponentAnimated(posX,posY-this.imagens.end.naturalHeight,this.imagens.end.naturalWidth/3,this.imagens.end.naturalHeight,this.imagens.end,Math.round(30/fator),3,0);
            this.assetsAnimated.push(endPoint);
            this.endPoint=endPoint;
            break;

          case 4: //grass
            var grass=new ComponentAnimated(posX,posY-this.imagens.grass.naturalHeight,this.imagens.grass.naturalWidth/3,this.imagens.grass.naturalHeight,this.imagens.grass,Math.round(60/fator),3,Math.round(Math.random()*2));
            this.assetsAnimated.push(grass);
            break;
			
					case 234: //shooterRight
						var shooter=new Shooter(posX,posY,this.imagens.shooterRight.naturalWidth,this.imagens.shooterRight.naturalHeight,this.imagens.shooterRight,1500,Math.round(3*fator),0,this.imagens.bullet.naturalWidth,this.imagens.bullet.naturalHeight,this.imagens.bullet);
						this.shooters.push(shooter);
						break;

					case 14: //shooterLeft
						var shooter=new Shooter(posX,posY-this.imagens.shooterLeft.naturalHeight,this.imagens.shooterLeft.naturalWidth,this.imagens.shooterLeft.naturalHeight,this.imagens.shooterLeft,1500,Math.round(-3*fator),0,this.imagens.bullet.naturalWidth,this.imagens.bullet.naturalHeight,this.imagens.bullet);
            this.shooters.push(shooter);
						break;

					case 8: //ground
						var asset=new Component(posX,posY-this.imagens.ground.naturalHeight,this.imagens.ground.naturalWidth,this.imagens.ground.naturalHeight,this.imagens.ground);
						this.assets.push(asset);
						break;

					case 9: //groundRight
						var asset=new Component(posX,posY-this.imagens.groundRight.naturalHeight,this.imagens.groundRight.naturalWidth,this.imagens.groundRight.naturalHeight,this.imagens.groundRight);
						this.assets.push(asset);
						break;

					case 10: //groundLeft
						var asset=new Component(posX,posY-this.imagens.groundLeft.naturalHeight,this.imagens.groundLeft.naturalWidth,this.imagens.groundLeft.naturalHeight,this.imagens.groundLeft);
						this.assets.push(asset);
						break;
					
					case 15: //lamp
            var lamp=new ComponentAnimated(posX,posY-this.imagens.lamp.naturalHeight,this.imagens.lamp.naturalWidth/16,this.imagens.lamp.naturalHeight,this.imagens.lamp,Math.round(15/fator),16,0);
            this.assetsAnimated.push(lamp);
            break;
					case 31: //plataformaIce
            var asset=new Component(posX,posY-this.imagens.plataformaIce.naturalHeight,this.imagens.plataformaIce.naturalWidth,this.imagens.plataformaIce.naturalHeight,this.imagens.plataformaIce);
            this.assets.push(asset);
            break;

          case 32: //end2
            var endPoint=new ComponentAnimated(posX,posY-this.imagens.end2.naturalHeight,this.imagens.end2.naturalWidth/8,this.imagens.end2.naturalHeight,this.imagens.end2,Math.round(20/fator),8,0);
            this.assetsAnimated.push(endPoint);
            this.endPoint=endPoint;
            break;
					
          default:
            break;
        }

      }
    }
    
    
  }

  //reads data from a file and returns it
  read(file_path) {
      var allText = ""
      var rawFile = new XMLHttpRequest();

      rawFile.onreadystatechange = function () {
          if (rawFile.readyState === 4) {
              if (rawFile.status === 200 || rawFile.status === 0) {
                 allText = rawFile.responseText;
              }
          }
      }

      rawFile.open("GET", file_path, false);
      rawFile.send(null);
      
      return allText;
  }

}
