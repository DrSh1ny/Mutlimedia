"use strict";

(function()
{
	window.addEventListener("load", loadingScreen);
}());


function main(imagens, sounds){
    
    
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var elements = new Array()
    var imagens=imagens;
	var sounds = sounds;
    var keys={left:"ArrowLeft",right:"ArrowRight",jump:"Space",attack:"KeyE"};

    var clickHandler=function(ev){
        elements=canvasClickHandler(ev,elements,imagens,canvas, sounds);
        drawElements(ctx,elements,imagens);
    }

    var mouseMoveHandler=function(ev) {
        canvasMouseMoveHandlder(ev,elements,imagens,canvas);
    }

    canvas.keys=keys;
    canvas.eventListeners={click:clickHandler , mouseMove:mouseMoveHandler};
    canvas.framerate=60;

    ctx.imageSmoothingEnabled = false;
    canvas.style.backgroundImage = "url('../resources/background.png')";

	elements=mainMenu(canvas,elements,imagens);
    drawElements(ctx,elements,imagens);
    

    canvas.addEventListener("click",clickHandler);
    canvas.addEventListener("mousemove",mouseMoveHandler);


}


function mainMenu(canvas,elements,imagens){
    var height = canvas.height;
    var width = canvas.width;


    var elementos= new Array();


    var botaoJogar = new Component(2*width/5,2.5*height/4,300,60,imagens.Jogar,imagens.JogarHover);
    var botaoOpcao = new Component(width/7,2.51*height/4,300,60,imagens.Opcao,imagens.OpcaoHover);
    var botaoCreditos = new Component(10*width/15,2.5*height/4,300,60,imagens.Creditos,imagens.CreditosHover);

    elementos.push(botaoJogar);
    elementos.push(botaoOpcao);
    elementos.push(botaoCreditos);
    return elementos;

}


function menuModo(canvas,elements,imagens){
    var height = canvas.height;
    var width = canvas.width;


    var elementos= new Array();

    var botaoInfinito = new Component(40,height/2+5,700,110,imagens.modo_infinito,imagens.modo_infinitoHover);
    var botaoClassico = new Component(width-740,height/2,700,100,imagens.modo_classico,imagens.modo_classicoHover);
    var botaoVoltar = new Component(10,height-50,300,50,imagens.Voltar,imagens.VoltarHover);

    elementos.push(botaoInfinito);
    elementos.push(botaoClassico);
    elementos.push(botaoVoltar);
    return elementos;

}

function menuNiveis(canvas,elements,imagens){
    var height = canvas.height;
    var width = canvas.width;


    var elementos= new Array();

    var capitulo1 = new Component(50,height/4,400,80,imagens.capitulo1,imagens.capitulo1Hover,);
    var capitulo2 = new Component(50+width/3,height/4,400,80,imagens.capitulo2,imagens.capitulo2Hover);
    var capitulo3 = new Component(50+2*width/3,height/4,400,80,imagens.capitulo3,imagens.capitulo3Hover);

    var um = new Component(60,350,80,80,imagens.um,imagens.umHover);
    var dois = new Component(160,350,80,80,imagens.dois,imagens.doisHover);
    var tres = new Component(260,350,80,80,imagens.tres,imagens.tresHover);

    var um2 = new Component(590,350,80,80,imagens.um,imagens.umHover);
    var dois2 = new Component(690,350,80,80,imagens.dois,imagens.doisHover);
    var tres2 = new Component(790,350,80,80,imagens.tres,imagens.tresHover);

    var um3 = new Component(1120,350,80,80,imagens.um,imagens.umHover);
    var dois3 = new Component(1220,350,80,80,imagens.dois,imagens.doisHover);
    var tres3 = new Component(1320,350,80,80,imagens.tres,imagens.tresHover);

    var botaoVoltar = new Component(10,height-50,300,50,imagens.Voltar,imagens.VoltarHover);

    elementos.push(capitulo1);
    elementos.push(capitulo2);
    elementos.push(capitulo3);

    elementos.push(um);
    elementos.push(dois);
    elementos.push(tres);
    elementos.push(um2);
    elementos.push(dois2);
    elementos.push(tres2);
    elementos.push(um3);
    elementos.push(dois3);
    elementos.push(tres3);

    elementos.push(botaoVoltar);
    return elementos;

}


function optionsMenu(canvas,elements,imagens,sons){
    var height = canvas.height;
    var width = canvas.width;
    var stateVolume=imagens.volumeMax;
    var elementos= new Array();

    var mediaVolume=0;
    var i=0;
    Object.keys(sons).forEach(function(key,index) {
        mediaVolume+=sons[key].volume;
        i++;
    });
        
    mediaVolume=mediaVolume/i;
    if(mediaVolume<=0){
        stateVolume=imagens.volumeMute;
    }
    else if(mediaVolume<0.3){
        stateVolume=imagens.volumeMinium;
    }
    else if(mediaVolume<0.6){
        stateVolume=imagens.volumeMedium;
    }
    else{
        stateVolume=imagens.volumeMax;
    }
    


    var minus = new Component(width/7,height/2,50,20,imagens.minus,imagens.minusHover);
    var plus = new Component(width/7+200,height/2-15,50,50,imagens.plus,imagens.plusHover);
    var volume = new Component(width/7+50,height/2-70,150,150,stateVolume,stateVolume)
    var Keybinding = new Component(9*width/15,height/2-30,600,70,imagens.Keybinding,imagens.KeybindingHover);
    var Help = new Component(2*width/5,height/2-100,200,200,imagens.Help,imagens.HelpHover);
    var botaoVoltar = new Component(10,height-50,300,50,imagens.Voltar,imagens.VoltarHover);

    var framerate1 = new Component(400,700,300,70,imagens["60hz"],imagens["60hzHover"]);
    var framerate2 = new Component(width-800,685,330,100,imagens["144hz"],imagens["144hzHover"]);

    elementos.push(framerate1);
    elementos.push(framerate2);
    elementos.push(minus);
    elementos.push(plus);
    elementos.push(Keybinding);
    elementos.push(Help);
    elementos.push(botaoVoltar);
    elementos.push(volume)
    return elementos
}


function mainAntigo(imagens,sounds){
    var nivel=new Level(imagens,sounds,1600,900,"../resources/mapa2.json",imagens.background,imagens.afonso1);
    nivel.loadLevel();
    var elementos=nivel.run();
    return elementos;
}


function drawElements(ctx,elements,imagens){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if(elements.length>0 && elements[0].img.id=="Jogar"){
        ctx.drawImage(imagens.Logo,ctx.canvas.width/2-350,40,734,536);
    }
    for(let i=0;i<elements.length;i++){
        elements[i].render(ctx);
    }
}

function keyMenu(canvas,elements,imagens,sounds){
    var selected=null;
    var keys=canvas.keys;
    var elementos=new Array();
    var id;
    var ctx=canvas.getContext("2d");
    
    var esquerda=new Component(195,100,imagens.esquerda.naturalWidth,imagens.esquerda.naturalHeight,imagens.esquerda,imagens.esquerdaHover);
    var direita=new Component(200,240,imagens.direita.naturalWidth,imagens.direita.naturalHeight,imagens.direita,imagens.direitaHover);
    var saltar=new Component(197,380,imagens.saltar.naturalWidth,imagens.saltar.naturalHeight,imagens.saltar,imagens.saltarHover);
    var atacar=new Component(200,520,imagens.atacar.naturalWidth,imagens.atacar.naturalHeight,imagens.atacar,imagens.atacarHover);
    var voltar=new Component(10,canvas.height-50,300,50,imagens.Voltar,imagens.VoltarHover);
    elementos.push(voltar);
    elementos.push(atacar);
    elementos.push(saltar);
    elementos.push(esquerda);
    elementos.push(direita);
    
    canvas.removeEventListener("click",canvas.eventListeners.click);
    canvas.removeEventListener("mousemove",canvas.eventListeners.mouseMove);
    typeBindedKeys(canvas,imagens,elementos,keys,selected);

    var mouseMoveHandler=function(ev) {
        canvasMouseMoveHandlder(ev,elementos,imagens,canvas);
        typeBindedKeys(canvas,imagens,elementos,keys,selected);
    }

    var keyUpHandler=function(ev){
        keyUpHandlerOuter(ev,keys,selected);
        selected=null;
        typeBindedKeys(canvas,imagens,elementos,keys,selected);
    }

    var keyClickHandler=function(ev){
        selected=keyClickHandlerOuter(ev,canvas,elementos,keys,selected);
        typeBindedKeys(canvas,imagens,elementos,keys,selected);
        if(selected=="Voltar"){
            canvas.removeEventListener("mousemove",mouseMoveHandler);
            canvas.removeEventListener("click",keyClickHandler);
            document.removeEventListener("keyup", keyUpHandler);
            canvas.addEventListener("mousemove",canvas.eventListeners.mouseMove);
            canvas.addEventListener("click",canvas.eventListeners.click);

            canvas.keys=keys;
            
        }
    }

    
    canvas.addEventListener("mousemove",mouseMoveHandler);
    canvas.addEventListener("click",keyClickHandler);
    document.addEventListener("keyup", keyUpHandler);
    

    return mainMenu(canvas,elements,imagens);
}

function typeBindedKeys(canvas,imagens,elementos,keys,selected){
    var ctx=canvas.getContext("2d");

    drawElements(ctx,elementos,imagens);
    Object.keys(keys).forEach(function(key,index) {
        
        if((selected=="direita" && key=="right") || (selected=="esquerda" && key=="left") ||  (selected=="saltar" && key=="jump") ||  (selected=="atacar" && key=="attack")){
            ctx.fillStyle="#ffffff";
            ctx.font = '48px xirod';
        }
        else{
            ctx.fillStyle="#274547";
            ctx.font = '48px xirod';
        }
        ctx.fillText(keys[key], 1000, 160+140*index);            
    });

    if(selected!=null){
        ctx.fillText("Pressione uma tecla!", 370, 700);
    }

}

 function keyUpHandlerOuter(ev,keys,selected){
    switch (selected) {
        case "direita":
            keys.right=ev.code;
            break;
        case "esquerda":
            keys.left=ev.code;
            break;
        case "saltar":
            keys.jump=ev.code;
            break;
        case "atacar":
            keys.attack=ev.code;
            break;
        default:
            break;
    }
 }

function keyClickHandlerOuter(ev,canvas,elementos,keys,selected){
    for(let i=0;i<elementos.length;i++){
        if (elementos[i].mouseOverBoundingBox(ev)){
            return elementos[i].img.id;
        }
    }
    return null;
}

function canvasClickHandler(ev, elements,imagens,canvas, sounds){
    var x=ev.offsetX;
    var y=ev.offsetY;
    for(let i=0;i<elements.length;i++){
        if (elements[i].mouseOverBoundingBox(ev)){

            switch (elements[i].img.id) {

				case "Jogar":
                    var elementos=menuModo(canvas,elements,imagens);
					sounds.buttonSound.play();
                    return elementos;

                case "Opcao":
                    sounds.buttonSound.play();
                    var elementos=optionsMenu(canvas,elements,imagens,imagens.volumeMax)
                    return elementos;

                case "Keybinding":
                    sounds.buttonSound.play();
                    var elementos=keyMenu(canvas,elements,imagens,sounds);
                    return elementos;

                case "Help":
                    ajuda();
                    return elements;

                case "minus":
                    Object.keys(sounds).forEach(function(key,index) {
                        sounds[key].volume=Math.max(0,Math.min(1,sounds[key].volume-0.1));
                    });
                    sounds.buttonSound.play();
                    var elementos=optionsMenu(canvas,elements,imagens,sounds)
                    return elementos;

                case "plus":
                    Object.keys(sounds).forEach(function(key,index) {
                        sounds[key].volume=Math.max(0,Math.min(1,sounds[key].volume+0.1));
                    });
                    sounds.buttonSound.play();
                    var elementos=optionsMenu(canvas,elements,imagens,sounds)
                    return elementos;

				case "Voltar":
                    var elementos=mainMenu(canvas,elements,imagens);
					sounds.buttonSound.play();
                    return elementos;

                case "modo_classico":
                    var elementos=menuNiveis(canvas,elements,imagens);
					sounds.buttonSound.play();
                    return elementos;

                case "um":
                    return chooseLevel(x,y,imagens,sounds,"um",canvas);
                case "dois":
                    return chooseLevel(x,y,imagens,sounds,"dois",canvas);
                case "tres":
                    return chooseLevel(x,y,imagens,sounds,"tres",canvas);

                case "60hz":
                    canvas.framerate=60;
                    sounds.buttonSound.play();
                    return elements;

                case "144hz":
                    canvas.framerate=144;
                    sounds.buttonSound.play();
                    return elements;

				default:
                    return elements;

			}
        }
    }
    return elements;
}


function chooseLevel(x,y,imagens,sons,nivel,canvas){
    var background=imagens.background;
    var personagem=imagens.afonso1;
    var levelSound=sons.levelSound2;
    var path="../resources/mapa1.json";

    canvas.style.cursor="default";
    
    switch (nivel) {
        case "um":
            if(x<400){
                break;
            }
            else if(x>400 & x<1000){
                background=imagens.background1;
                path="../resources/mapa4.json";
                break;
            }
            else if(x>1000){
                background=imagens.background2;
                path="../resources/mapa7.json";
                break;
            }
            break;
        case "dois":
            if(x<400){
                path="../resources/mapa2.json";
                break;
            }
            else if(x>400 & x<1000){
                background=imagens.background1;
                path="../resources/mapa5.json";
                break;
            }
            else if(x>1000){
                background=imagens.background2;
                path="../resources/mapa8.json";
                break;
            }
            break;
        case "tres":
            if(x<400){
                path="../resources/mapa3.json";
                break;
            }
            else if(x>400 & x<1000){
                background=imagens.background1;
                path="../resources/mapa6.json";
                break;
            }
            else if(x>1000){
                background=imagens.background2;
                path="../resources/mapa9.json";
                break;
            }
            break;
        default:
            break;
    }

    var nivel=new Level(imagens,sons,1600,900,path,background,personagem,levelSound);
    nivel.loadLevel();
    var elementos=nivel.run();
    return elementos;

}

function canvasMouseMoveHandlder(ev,elementos,imagens,canvas) {
    var x=ev.offsetX;
    var y=ev.offsetY;
    var hovered=false;
    var ctx=canvas.getContext("2d");
    for(let i=0;i<elementos.length;i++){
        if (elementos[i].mouseOverBoundingBox(ev)){
            canvas.style.cursor = "pointer";
            elementos[i].hover=true;
            drawElements(ctx,elementos,imagens);
            return;

        }
        elementos[i].hover=false;

    }
    drawElements(ctx,elementos,imagens);
    canvas.style.cursor = "default";


}

function ajuda(){
    var nWindow = window.open("","","width = 700, height = 150");
    nWindow.document.write("<h1><b>Instruções de Jogo</b></h1>A personagem tem <b>3 vidas</b>. Quando estas chegam a 0, é game over!<br>A personagem consegue <b>saltar</b>, <b>andar</b> para a direita ou esquerda e <b>disparar</b> projécteis.<br>As teclas variam consoante as suas bindings que podem ser vistas no menu de bindings nas opcões.<br>")
  }

function loadingScreen() {
    var imagens={}; //onde vao ser guardadas todas as imagens do programa
	var sounds = {};
    var resourcesImg=["comecar","comecarHover","bridge","bridgeRight","bridgeLeft","reiniciar","reiniciarHover","sair","sairHover","swordRight","swordLeft","144hz","144hzHover","60hz","60hzHover","esquerdaHover","direitaHover","saltarHover","atacarHover","esquerda","direita","saltar","atacar","end2","plataformaIce","lamp","groundRight","groundLeft","ground","heart","pause","shooterRight","shooterLeft","bullet","Help","HelpHover","volumeMax","volumeMedium","volumeMinium","volumeMute","end","grass","back","Logo","um","dois","tres","quatro","cinco","seis","umHover","doisHover","tresHover","quatroHover","cincoHover","seisHover","afonso","afonso1","background","background1","background2","box1","capitulo1","capitulo1Hover","capitulo2","capitulo2Hover","capitulo3","capitulo3Hover","Creditos","CreditosHover","IronBar","Jogar","JogarHover","Keybinding","KeybindingHover","minus","minusHover","modo_classico","modo_classicoHover","modo_infinito","modo_infinitoHover","Opcao","OpcaoHover","plataforma","plus","plusHover","Som","SomHover","Voltar","VoltarHover","box2"]
	var	resourcesSound = ["intro","shout","gun","sword1","sword2","levelSound2","levelSound1","levelButtonSound", "buttonSound"];
    var toLoad=resourcesImg.length + resourcesSound.length;
    var loaded=0;


    for(let i=0,l=resourcesImg.length;i<l;i++){
        let source=resourcesImg[i];
        let imagem=new Image();

        imagens[source]=imagem;
        imagem.id=source;
        imagem.addEventListener("load", resourcesLoadedHandler);
        imagem.src="../resources/"+source+".png";
    }

    for(let i=0,l=resourcesSound.length;i<l;i++){
        let source = resourcesSound[i];
        let sound = new Audio();

        sounds[source] = sound;
        sound.id = source;
        sound.src = "../resources/sounds/" + source + ".mp3";
        resourcesLoadedHandler();
    }


    function resourcesLoadedHandler(ev){
        loaded++;

        if(loaded==toLoad){
            //main(imagens, sounds);
            intro(imagens,sounds);
        }
    }


}


function intro(imagens,sons){
   
    var som=sons.intro;
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var frames=["Em tempos distantes a Terra era(br)pacificamente habitada por seres(br)humanos.  Inovação e ciência eram(br)a fundacao das sociedades de todo(br)o mundo e traziam luz e(br)conforto à vida de todos.(br)Até que um dia tudo mudou....(br)","Tudo começou com a invenção de(br)AI-Inteligência Artificial(br)Do dia para a noite os(br)cientistas eram capazes de(br)conceber máquinas com(br) inteligência e sentimentos(br)","Até ao dia em que AI se tornou(br)tão poderoso que todas as máquinas,(br)fartas da subjugação à humanidade,(br)se revoltaram, e quase destruiram o(br)mundo e exterminaram a raça humana.(br)","Depois de muitos anos nas sombras(br)um cientista finalmente inventou(br)um dispositivo capaz de recuscitar(br)mortos. A melhor chance de derrotar(br)os robôs era trazer de volta os(br)heróis do passado.(br) A começar por ti...(br)","Bem vindo, Dom Afonso Henriques,(br)o seu objetivo será encontrar(br)e derrotar as criaturas mecânicas(br) espalhadas pelo globo e trazer(br)de novo a glória do passado!(br)"];
    var slide=-1;
    var comecar=new Component(canvas.width/2-300,canvas.height/2-60,600,120,imagens.comecar,imagens.comecarHover);

    drawFrame(canvas,ctx,null,imagens,comecar);

    canvas.addEventListener("click",nextFrame);
    canvas.addEventListener("mousemove",hover);

    function hover(ev){
        hoverOuter(ev,canvas,ctx,imagens,sons,frames,slide,som,comecar);
    }

    function nextFrame(ev){
        slide=nextFrameOuter(ev,canvas,ctx,imagens,sons,frames,slide,hover,nextFrame,som,comecar);    
    }
    
}


function hoverOuter(ev,canvas,ctx,imagens,sons,frames,slide,som,comecar){
    if (comecar.mouseOverBoundingBox(ev)){
        canvas.style.cursor = "pointer";
        comecar.hover=true;
        drawFrame(canvas,ctx,null,imagens,comecar);
    }
    else{
        canvas.style.cursor = "default";
        comecar.hover=false;
        drawFrame(canvas,ctx,null,imagens,comecar);
    }
}

function nextFrameOuter(ev,canvas,ctx,imagens,sons,frames,slide,evL1,evL2,som,comecar){
    console.log(slide);
    
    if(slide==-1 && comecar.mouseOverBoundingBox(ev)){
        canvas.removeEventListener("mousemove",evL1);
        som.currentTime=30;
        som.play();
        slide++;
        drawFrame(canvas,ctx,frames[slide],imagens);
    }
    else if(slide==-1 && !(comecar.mouseOverBoundingBox(ev))){
        drawFrame(canvas,ctx,null,imagens,comecar);
    }
    else if(slide>frames.length-2){
        canvas.removeEventListener("click",evL2);
        var id=setInterval(reduceVolume,30,som,id);
        main(imagens,sons);

    }
    else{
        slide++;
        drawFrame(canvas,ctx,frames[slide],imagens);
        
    }
    
    return slide;
}

function reduceVolume(som,id){
    som.volume=Math.max(som.volume-0.005,0);
    if(som.volume<=0){
        clearInterval(id);
    }
}

function drawFrame(canvas,ctx,frame,imagens,start=null,comecar){
    if(start!=null){
        ctx.drawImage(imagens.background,0,0);
        ctx.fillStyle='rgba(0, 0, 0, 0.87)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        start.render(ctx);
        return;
    }

    ctx.font = '48px Xirod';
    ctx.textAlign = "center";

    ctx.drawImage(imagens.background,0,0);
    ctx.fillStyle='rgba(0, 0, 0, 0.87)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="white";
    //ctx.fillText(frame, 0,50);
    
    var array=frame.split('(br)');
    for(let i=0;i<array.length;i++){
        
        ctx.fillText(array[i], canvas.width/2,i*70+180);
    }

    
    ctx.font = '30px Xirod';
    ctx.fillText("Clique para continuar", canvas.width/2,800);

}

