'use strict';



class Level{

  constructor(imagens,sounds,path,background,character,levelSound){
    this.charX;
    this.charY;

    

    this.sprites
    this.assets;
    this.assetsAnimated;
    this.shooters;

		this.imagens=imagens;
    this.sounds=sounds;
    
    this.path=path;
    this.background=background;
    this.character=character;
    this.levelSound=levelSound;

    
    this.timeIni = 0;
    this.timeLevel = 0;
    this.timePaused = 0;
    this.timePausedIni = 0;
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
		var levelSound=this.levelSound;
    var elementos=menuNiveis(canvas,[],this.imagens); //para apresentar quando o nivel acabar
		var endPoint=this.endPoint;
		var self=this;
    var elementosNivel=new Array();
    //for character movement
    var id;
    var d = new Date();
    var lastFrame =d.getTime();

    //for the time spent in the level
    this.timeIni = d.getTime();

    switch (this.character) {
      case imagens.afonso1:
        var char=new Character(Number(this.charX),Number(this.charY),64,88,this.imagens.afonso1,assets,shooters,imagens,sounds,4,10,this.width);
        break;
    }
    //var char=new Character(Number(this.charX),Number(this.charY),64,88,this.imagens.afonso1,assets,shooters,imagens,sounds);
    assets.push(char);

    //camera
    var camera=new Camera(0,0,800,450);
    //var camera=new Camera(0,0,1066,600);
    var mapa = {x:0, y:0, width:self.width, height:self.height};

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
    
    var flag = 0;
    var d2 = new Date();

    render();

    function render(time){
      gamestate = self.evaluateEnding(char,assets,assetsAnimated,bullets,endPoint,mapa, gamestate);
      if(gamestate=="end"){//evaluate ending conditions
        //self.clearLevel(canvas,assets,assetsAnimated,shooters,bullets,bulletFiredHandler,keyUpLevelHandler,sounds,imagens,id,elementos,levelSound,volumeInicial);
        if (flag == 0){
          d2 = new Date();
          gamestate = "end";
          //stop the bots bullets
          self.clearBotBullets(canvas, shooters, bulletFiredHandler);
        }
        self.timeLevel = d2.getTime() - self.timeIni - self.timePaused;

        //menu de fim de nivel
        self.endLevelMenu(ctx, self.timeLevel);
        id=requestAnimationFrame(render);
        flag ++;
        elementosNivel=[];
      
      }
      else if(gamestate == "finished"){
        //quando o user clicar o gamestate vai passar a finished e voltamos para o menu principal
        self.clearLevel(canvas,assets,assetsAnimated,shooters,bullets,bulletFiredHandler,keyUpLevelHandler,sounds,imagens,id,elementos,levelSound,volumeInicial);
        
      }
      else if(gamestate=="restart"){
        self.timeLevel = d.getTime() - self.timeIni - self.timePaused;
        self.clearLevel(canvas,assets,assetsAnimated,shooters,bullets,bulletFiredHandler,keyUpLevelHandler,sounds,imagens,id,elementos,levelSound,volumeInicial);

        var nivel=new Level(imagens,sounds,self.path,self.background,self.character,self.levelSound);
        nivel.loadLevel();
        nivel.run();
      }

      else if(gamestate=="run"){     
        var timePassed=time-lastFrame;

        self.shotsHandler(char,assets,shooters);
        self.bulletHandler(char,bullets,assets,shooters,sounds);
        self.soundHandler(char,assets,assetsAnimated,shooters,endPoint,sounds,levelSound);
        //character movement
        char.move(char,timePassed,ctx);
        //rendering of everything
        camera.updateAnim(imagens,char,assets,assetsAnimated,shooters,bullets,mapa,ctx,self.background);
        camera.drawHUD(ctx,char,imagens);
        
        lastFrame=time;//for move function
        id=requestAnimationFrame(render);
      }
      else if(gamestate=="pause"){
        camera.drawPauseMenu(imagens,char,assets,assetsAnimated,shooters,bullets,mapa,ctx,elementosNivel,self.background);
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
  

  clearBotBullets(canvas, shooters, bulletFiredHandler){
    for(let i=0;i<shooters.length;i++){
      clearInterval(shooters[i].id);//stop bullet firing
    }
    canvas.removeEventListener("bulletFired",bulletFiredHandler); //stop bullet firing listener
  }

  endLevelMenu(ctx, time){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //mudar a cor da canvas
    ctx.fillStyle='rgba(0, 0, 0, 0.87)';
    ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);

    ctx.font = '30px Xirod';
    ctx.textAlign = "center";
    ctx.fillStyle = 'white';

    //mostrar o tempo que o user demorou no nivel
    ctx.fillText("Time: " + time + "ms", ctx.canvas.width/2, ctx.canvas.height/2);

    ctx.fillText("Clique para continuar.", ctx.canvas.width/2, 800);
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
    if (gamestate == "end"){//para o menu de final de nivel
      //console.log("entrou");
      //gamestate = "finished";
      return "finished";
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
    /*
    for(let i=0;i<shooters.length;i++){
      clearInterval(shooters[i].id);//stop bullet firing
    }
    */
    this.clearBotBullets(canvas, shooters, bulletFiredHandler);
    document.removeEventListener("keyup",keyUpLevelHandler);
    //canvas.removeEventListener("bulletFired",bulletFiredHandler); //stop bullet firing listener
    canvas.addEventListener("click",canvas.eventListeners.click);
    canvas.addEventListener("mousemove",canvas.eventListeners.mouseMove);
    Object.keys(sounds).forEach(function(key,index) {
      sounds[key].volume=volumeInicial;
    });
    drawElements(ctx,elementos,imagens);	//draw end of level screen/menu
    levelSound.pause();
    levelSound.currentTime = 0;
    cancelAnimationFrame(id);	//stop rendering
  }
  
  keyUpLevelHandlerOuter(ev,gamestate,imagens,elementos){
    var d = new Date();

    if(ev.code=="Escape"){
      if(gamestate=="run"){
        var elementos=new Array();
        var sair=new Component(500,450,imagens.sair.naturalWidth,imagens.sair.naturalHeight,imagens.sair,imagens.sairHover);
        var reiniciar=new Component(500,330,imagens.reiniciar.naturalWidth,imagens.reiniciar.naturalHeight,imagens.reiniciar,imagens.reiniciarHover);
        elementos.push(sair);
        elementos.push(reiniciar);
        //save the time when the pause was started
        this.timePausedIni = d.getTime();

        return ["pause",elementos]

      }
      if(gamestate=="pause"){
        //calculate the time paused and sum it to the time that the game was paused (useful when the game is paused multiple times)
        this.timePaused += d.getTime() - this.timePausedIni;

        return ["run",[]]
      }
    }
    return [gamestate,[]];
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
	evaluateEnding(char,assets,assetsAnimated,bullets,endPoint,mapa, gamestate){
    //mostrar o menu de fim de nível
    //mostrar tempo e ranking, depois ir para o menu de niveis
    if(gamestate != "finished"){
  		if(char.checkPixelCollisionSpriteAnimated(char,endPoint)){
  			return "end";
  		}

      if(char.posY+char.height>=mapa.y+mapa.height){
        return "end";
      }

  		if(char.lives<1){
  				return "end";
  			}
      return gamestate
    }
    else{
      return "finished";
    }
	}

	//some shooter fired a bullet
	bulletFiredHandlerOuter(ev,sons,char){
    var xDistance=Math.abs(char.posX-ev.bullet.posX);
		var yDistance=Math.abs(char.posY-ev.bullet.posY);
		var distance=Math.sqrt(Math.pow(xDistance,2)+Math.pow(yDistance,2));
		var final=1-(distance/1500);
    sons.gun.volume=Math.max(0,sons.levelSound2.volume*final);
    sons.gun.play();
		return ev.bullet;
	}


  bulletHandler(char,bullets,assets,shooters,sons){   //check collition of bullets
    
		for(let i=0;i<bullets.length;i++){
			bullets[i].move();

			if(bullets[i].checkPixelCollisionCharacter(char,bullets[i])){
				bullets.splice(i,1);
        char.lives--;
        sons.shout.play();
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

  loadLevel(){
    //get the data in the file in a string
    var text = this.read(this.path);
    
    
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
    this.width=obj.width;
    this.height=obj.height;

    var array=this.getIDS(obj);
    //more can be added as long as the constructor and the level file are updated
    //translate the matrix into an array of components
    

    this.assets=new Array();
    this.assetsAnimated=new Array();
    this.shooters=new Array();
  
    for(let x=0;x<this.width;x++){
      for(let y=0;y<this.height;y++){
        var posX=x;
        var posY=y;
        
				var pos=y*(this.width) + x;
				
				
        switch (this.sprites[pos]) {
          case array[0]: //caixa1
            var asset=new Component(posX,posY-this.imagens.box1.naturalHeight,this.imagens.box1.naturalWidth,this.imagens.box1.naturalHeight,this.imagens.box1);
            this.assets.push(asset);
            break;
           
          case array[1]: //caixa2
            var asset=new Component(posX,posY-this.imagens.box2.naturalHeight,this.imagens.box2.naturalWidth,this.imagens.box2.naturalHeight,this.imagens.box2);
            this.assets.push(asset);
            break;
            
          case array[2]: //plataforma
            var asset=new Component(posX,posY-this.imagens.plataforma.naturalHeight,this.imagens.plataforma.naturalWidth,this.imagens.plataforma.naturalHeight,this.imagens.plataforma);
            this.assets.push(asset);
            break;
            

          case array[3]: //grass
            var grass=new ComponentAnimated(posX,posY-this.imagens.grass.naturalHeight,this.imagens.grass.naturalWidth/3,this.imagens.grass.naturalHeight,this.imagens.grass,Math.round(60/fator),3,Math.round(Math.random()*2));
            this.assetsAnimated.push(grass);
            break;
			
					case array[4]: //shooterRight
            var shooter=new Shooter(posX,posY-this.imagens.shooterRight.naturalHeight,this.imagens.shooterRight.naturalWidth,this.imagens.shooterRight.naturalHeight,this.imagens.shooterRight,1500,Math.round(3*fator),0,this.imagens.bullet.naturalWidth,this.imagens.bullet.naturalHeight,this.imagens.bullet);
            this.shooters.push(shooter);
						break;

					case array[5]: //shooterLeft
						var shooter=new Shooter(posX,posY-this.imagens.shooterLeft.naturalHeight,this.imagens.shooterLeft.naturalWidth,this.imagens.shooterLeft.naturalHeight,this.imagens.shooterLeft,1500,Math.round(-3*fator),0,this.imagens.bullet.naturalWidth,this.imagens.bullet.naturalHeight,this.imagens.bullet);
            this.shooters.push(shooter);
						break;

					case array[6]: //ground
						var asset=new Component(posX,posY-this.imagens.ground.naturalHeight,this.imagens.ground.naturalWidth,this.imagens.ground.naturalHeight,this.imagens.ground);
						this.assets.push(asset);
						break;

					case array[7]: //groundRight
						var asset=new Component(posX,posY-this.imagens.groundRight.naturalHeight,this.imagens.groundRight.naturalWidth,this.imagens.groundRight.naturalHeight,this.imagens.groundRight);
						this.assets.push(asset);
						break;

					case array[8]: //groundLeft
						var asset=new Component(posX,posY-this.imagens.groundLeft.naturalHeight,this.imagens.groundLeft.naturalWidth,this.imagens.groundLeft.naturalHeight,this.imagens.groundLeft);
						this.assets.push(asset);
						break;
					
					case array[9]: //lamp
            var lamp=new ComponentAnimated(posX,posY-this.imagens.lamp.naturalHeight,this.imagens.lamp.naturalWidth/16,this.imagens.lamp.naturalHeight,this.imagens.lamp,Math.round(15/fator),16,0);
            this.assetsAnimated.push(lamp);
            break;
					case array[10]: //plataformaIce
            var asset=new Component(posX,posY-this.imagens.plataformaIce.naturalHeight,this.imagens.plataformaIce.naturalWidth,this.imagens.plataformaIce.naturalHeight,this.imagens.plataformaIce);
            this.assets.push(asset);
            break;

          case array[11]: //end2
            console.log("WTF");
            var endPoint=new ComponentAnimated(posX,posY-this.imagens.end2.naturalHeight,this.imagens.end2.naturalWidth/8,this.imagens.end2.naturalHeight,this.imagens.end2,Math.round(20/fator),8,0);
            this.assetsAnimated.push(endPoint);
            this.endPoint=endPoint;
            break;
          
          case array[12]: //bridge
            var asset=new Component(posX,posY-this.imagens.bridge.naturalHeight,this.imagens.bridge.naturalWidth,this.imagens.bridge.naturalHeight,this.imagens.bridge);
            this.assets.push(asset);
            break;

					case array[13]: //bridgeRight
						var asset=new Component(posX,posY-this.imagens.bridgeRight.naturalHeight,this.imagens.bridgeRight.naturalWidth,this.imagens.bridgeRight.naturalHeight,this.imagens.bridgeRight);
						this.assets.push(asset);
					  break;

					case array[14]: //bridgeLeft
						var asset=new Component(posX,posY-this.imagens.bridgeLeft.naturalHeight,this.imagens.bridgeLeft.naturalWidth,this.imagens.bridgeLeft.naturalHeight,this.imagens.bridgeLeft);
						this.assets.push(asset);
            break;
            
          default:
            break;
        }

      }
    }
    
    
  }

  getIDS(obj){
    var array=["box1","box2","plataforma","grass","shooterRight","shooterLeft","ground","groundRight","groundLeft","lamp","plataformaIce","end2","bridge","bridgeRight","bridgeLeft"];
    var tilesets=obj.tilesets;
    
    
    for(let i=0;i<array.length;i++){
      for(let j=0;j<tilesets.length;j++){
        var name=tilesets[j].name;
        if(name==array[i]){
          console.log(array[i]);
          console.log(name);
          
          array[i]=tilesets[j].firstgid;
        }
      }
    }

    return array;
    
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
