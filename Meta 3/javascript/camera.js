"use strict";

///////////////
//update --> atualizar as coordenadas de todos os sprites e camara
//render --> percorrer os sprites e chamar o metodo draw desses sprites

//necessario fazer requestAnimationFrame e construir a estrutura necessaria para que o update e o render funcionem corretamente
//fazer funcao auxiliar para fazer o loop e depois nessa chamar o update e na update chamar a render





////////////////////////////


//  Vi no livro este tipo de camara, que usa uma inner box na qual o personagem se pode mover
//sem que a camara se mexa, se o personagem passar as boundaries dessa inner box, entao a camara mexe-se.

class Camera{


  //decidir onde a camara vai comecar no mapa atraves dos parametros x e y. (x e y tem de pertencer ao mapa.)
  constructor(x, y, width, height){
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
  }

  leftInnerBoxBoundary(){

    return this.x + this.width * 0.25;

  }

  rightInnerBoxDoundary(){

    return this.x + this.width * 0.75;

  }


  topInnerBoxBoundary(){

    return this.y + this.height * 0.1;

  }

  bottomInnerBoxBoundary(){

    return this.y + this.height * 0.75;

  }

  //chama o metodo draw da classe sprite
  render(images,char,sprites,spritesAnimated,shooters,bullets,mapa, ctx,background){
    ctx.drawImage(background,0,0);
    //the state saved will always be the default one, matrix starting at 0;0.
    ctx.save();
    //move the matrix to the area we want to show, the camara.
  
    
    
    ctx.scale(ctx.canvas.width/this.width,ctx.canvas.height/this.height);
    ctx.translate(-this.x, -this.y);
     
    for (let i = 0; i < sprites.length ; i++){
      sprites[i].render(ctx);
    }

    for (let i = 0; i < shooters.length ; i++){
      shooters[i].render(ctx);
    }

    for (let i = 0; i < spritesAnimated.length ; i++){
      spritesAnimated[i].render(ctx);
    }

    for (let i = 0; i < bullets.length ; i++){
      bullets[i].render(ctx);
    }

    for (let i=0;i<char.shots.length;i++){
        char.shots[i].render(ctx);
    }

      
    //restore the draw matrix to its default state.
    ctx.restore()
  }

  //preciso de saber o tamanho do mapa completo, para poder calcular os movimentos da camara em relacao a este
  //considerei que a personagem vai estar na segunda posicao do array de sprites
  updateAnim(images,char,sprites,spritesAnimated,shooters,bullets, mapa, ctx,background){

    var cw = ctx.canvas.width;
    var ch = ctx.canvas.height;
    var personagem = sprites[sprites.length-1];

    //dar clear da canvas
    ctx.clearRect(0,0, cw, ch);

    //calcular as posicoes do personagem


    //calcular a posicao da camara
    //usa-se o floor para que de sempre um valor possivel para o pixel

    //em relacao ao personagem
    if(personagem.posX < this.leftInnerBoxBoundary())
      this.x = Math.floor(personagem.posX - this.width * 0.25);
    if(personagem.posX + personagem.width > this.rightInnerBoxDoundary())
      this.x = Math.floor(personagem.posX + personagem.width - this.width * 0.75);
    if(personagem.posY < this.topInnerBoxBoundary())
      this.y = Math.floor(personagem.posY - this.height * 0.1);
    if(personagem.posY + personagem.height > this.bottomInnerBoxBoundary())
      this.y = Math.floor(personagem.posY + personagem.height - this.height * 0.75);

    //em relacao ao mapa (este sobrepoem-se a personagem)
    if(this.x < mapa.x)
      this.x = mapa.x;
    if(this.x + this.width > mapa.x + mapa.width)
      this.x = mapa.x + mapa.width - this.width;
    if(this.y < mapa.y)
      this.y = mapa.y;
    if(this.y + this.height > mapa.y + mapa.height)
      this.y = mapa.y + mapa.height - this.height;


    //chamar o render
    this.render(images,char,sprites,spritesAnimated,shooters,bullets,mapa, ctx,background);


    

  }

  drawHUD(ctx,char,images){
    ctx.drawImage(images.pause,10,0,images.pause.naturalWidth,images.pause.naturalHeight);
    for(let i=0;i<char.lives;i++){
      ctx.drawImage(images.heart,1500-70*i,10,images.heart.naturalWidth,images.heart.naturalHeight);
    }
  }

  
  drawPauseMenu(images,char,sprites,spritesAnimated,shooters,bullets,mapa, ctx,elementos,background){
    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
    this.render(images,char,sprites,spritesAnimated,shooters,bullets,mapa, ctx,background);

    ctx.beginPath();  //darken whole scene
    ctx.fillStyle = "rgba(0,0,0,0.3";
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fill();

    ctx.beginPath();    //iner menu box
    ctx.fillStyle = "rgba(0,0,0,0.3";
    ctx.rect(ctx.canvas.width/2-400, ctx.canvas.height/2-150, 800,300);
    ctx.fill();

    for(let i=0;i<elementos.length;i++){
      elementos[i].render(ctx);
    }
    

  }

  drawEndLevelMenu(ctx, time,finalText){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //mudar a cor da canvas
    ctx.fillStyle='rgba(0, 0, 0, 0.60)';
    ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);

    ctx.font = '30px Xirod';
    ctx.textAlign = "center";
    ctx.fillStyle = 'white';

    //mostrar o tempo que o user demorou no nivel
    ctx.fillText("Tempo decorrido:",ctx.canvas.width/2, ctx.canvas.height/2-100)
     
    ctx.fillText(time/1000 + " segundos", ctx.canvas.width/2, ctx.canvas.height/2-60);
    ctx.fillText("Ranking", ctx.canvas.width/2, ctx.canvas.height/2);
    if(finalText != null){
      var text = finalText.split("<br>").filter(function(el) {return el.length != 0});;
      
      for (let index = 0; index < text.length; index++) {
        ctx.fillText(text[index],ctx.canvas.width/2, ctx.canvas.height/2+80+40*index)
        
      };
    }
    ctx.fillText("Clique para continuar.", ctx.canvas.width/2, 800);
  }

  drawStoryFrame(ctx, text){
    //split das frases por (br)
    //dar display de todas

    ctx.font = '48px Xirod';
    ctx.textAlign = "center";

    ctx.fillStyle='rgba(0, 0, 0, 0.87)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="white";


    var lines = text.split("(br)");
    for (let i = 0; i < lines.length ; i++){
      ctx.fillText(lines[i], ctx.canvas.width/2, i*70+180);
    }

    ctx.font = '30px Xirod';
    ctx.fillText("Clique para continuar", canvas.width/2,800);
  }

}
