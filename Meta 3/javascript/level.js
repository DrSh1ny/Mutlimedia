'use strict';



class Level{

  constructor(imagens,width,height){
    this.charX;
    this.charY;

    this.width=width;
    this.height=height;

    this.sprites
    this.assets;

    this.imagens=imagens;
  }

  
  run(){
    var canvas=document.getElementById("canvas");
    var ctx=canvas.getContext("2d");
    var nw=canvas.width;
    var nh=canvas.height;
    var assets=this.assets; //todos os componenentes do nivel e o character incluido
    
    
    
    var char=new Character(Number(this.charX),Number(this.charY),64,88,this.imagens.afonso1,assets);
    assets.push(char);
    //camera
    var camera=new Camera(0,0,800,450);
    //var camera=new Camera(0,0,1066,600);
    var mapa = {x:0, y:0, width:1600, height:900};

    char.move(char,0,0,ctx);
    render();
    
    
    function render(){
       
        camera.updateAnim(assets,mapa,ctx);
        
        requestAnimationFrame(render);
    }

  }

  loadLevel(file_path){
    //get the data in the file in a string
    var text = this.read(file_path);
    
    
    //parse the string using JSON.parse()
    var obj = JSON.parse(text);

    
    //assign the data to the respective atribute of the level
    this.charX = obj.charx;
    this.charY = obj.chary;
    this.sprites = obj.sprites;

  
    
    //more can be added as long as the constructor and the level file are updated
    //translate the matrix into an array of components
    //divide level space into grids
    //calculate unit square width and height
    var squareWidth=this.width/1600;
    var squareHeight=this.height/900;

    this.assets=new Array();
    
  
    for(let x=0;x<1600;x++){
      for(let y=0;y<900;y++){
        var posX=x*squareWidth;
        var posY=y*squareHeight;
        
        var pos=y*1600 + x;
        switch (this.sprites[pos]) {
          case 1: //plataforma
            var asset=new Component(posX,posY,this.imagens.plataforma.naturalWidth,this.imagens.plataforma.naturalHeight,this.imagens.plataforma);
            this.assets.push(asset);
            break;
            
          case 2: //caixa2
            var asset=new Component(posX,posY,this.imagens.box2.naturalWidth,this.imagens.box2.naturalHeight,this.imagens.box2);
            this.assets.push(asset);
            break;
            
          case 3: //caixa1
            var asset=new Component(posX,posY,this.imagens.box1.naturalWidth,this.imagens.box1.naturalHeight,this.imagens.box1);
            this.assets.push(asset);
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
