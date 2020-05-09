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

    var capitulo1 = new Component(50,height/4,400,40,imagens.capitulo1,imagens.capitulo1Hover);
    var capitulo2 = new Component(50+width/3,height/4,400,40,imagens.capitulo2,imagens.capitulo2Hover);
    var capitulo3 = new Component(50+2*width/3,height/4,400,40,imagens.capitulo3,imagens.capitulo3Hover);

    var um = new Component(80,1.2*height/4+49,40,40,imagens.um,imagens.umHover);
    var dois = new Component(130,1.2*height/4+50,40,40,imagens.dois,imagens.doisHover);
    var tres = new Component(190,1.2*height/4+50,40,40,imagens.tres,imagens.tresHover);

    var botaoVoltar = new Component(10,height-50,300,50,imagens.Voltar,imagens.VoltarHover);

    elementos.push(capitulo1);
    elementos.push(capitulo2);
    elementos.push(capitulo3);

    elementos.push(um);
    elementos.push(dois);
    elementos.push(tres);

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
    var nivel=new Level(imagens,sounds,1600,900);
    nivel.loadLevel("../resources/mapa2.json");
    var elementos =nivel.run();
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
    //var atacar=new Component(200,520,imagens.atacar.naturalWidth,imagens.atacar.naturalHeight,imagens.atacar);
    var voltar=new Component(10,canvas.height-50,300,50,imagens.Voltar,imagens.VoltarHover);
    elementos.push(voltar);
    //elementos.push(atacar);
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
        
        if((selected=="direita" && key=="right") || (selected=="esquerda" && key=="left") ||  (selected=="saltar" && key=="jump")){
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
        ctx.fillText("Pressione uma tecla!", 370, 600);
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
                    canvas.style.cursor = "default";
					sounds.levelButtonSound.play()
                    var elementos=mainAntigo(imagens,sounds);

                    return elementos;

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


function loadingScreen() {
    var imagens={}; //onde vao ser guardadas todas as imagens do programa
	var sounds = {};
    var resourcesImg=["reiniciar","reiniciarHover","sair","sairHover","swordRight","swordLeft","144hz","144hzHover","60hz","60hzHover","esquerdaHover","direitaHover","saltarHover","atacarHover","esquerda","direita","saltar","atacar","end2","plataformaIce","lamp","groundRight","groundLeft","ground","heart","pause","shooterRight","shooterLeft","bullet","Help","HelpHover","volumeMax","volumeMedium","volumeMinium","volumeMute","end","grass","back","Logo","um","dois","tres","quatro","cinco","seis","umHover","doisHover","tresHover","quatroHover","cincoHover","seisHover","afonso","afonso1","background","box1","capitulo1","capitulo2","capitulo3","Creditos","CreditosHover","IronBar","Jogar","JogarHover","Keybinding","KeybindingHover","minus","minusHover","modo_classico","modo_classicoHover","modo_infinito","modo_infinitoHover","Opcao","OpcaoHover","plataforma","plus","plusHover","Som","SomHover","Voltar","VoltarHover","box2"]
	var	resourcesSound = ["gun","sword1","sword2","levelSound2","levelSound1","levelButtonSound", "buttonSound"];
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
            main(imagens, sounds);
        }
    }


}

