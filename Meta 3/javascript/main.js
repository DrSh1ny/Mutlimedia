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

    ctx.imageSmoothingEnabled = false;
    canvas.style.backgroundImage = "url('../resources/background.png')";

	elements=mainMenu(canvas,elements,imagens);
    drawElements(ctx,elements,imagens);


    canvas.addEventListener("click",clickHandler);
    canvas.addEventListener("mousemove",mouseMoveHandler);



    function clickHandler(ev){
        elements=canvasClickHandler(ev,elements,imagens,canvas, sounds);
        drawElements(ctx,elements,imagens);
    }

    function mouseMoveHandler(ev) {
        canvasMouseMoveHandlder(ev,elements,imagens,canvas);
    }



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

function mainAntigo(imagens){
    var nivel=new Level(imagens,1600,900);
    nivel.loadLevel("../resources/mapa1.json");
    nivel.run();



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

function canvasClickHandler(ev, elements,imagens,canvas, sounds){


    for(let i=0;i<elements.length;i++){
        if (elements[i].mouseOverBoundingBox(ev)){

            switch (elements[i].img.id) {
								case "Jogar":
                    var elementos=menuModo(canvas,elements,imagens);
					sounds.buttonSound.play();
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
					sounds.levelButtonSound.play()
                    var elementos=mainAntigo(imagens);
                    return elementos;

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
<<<<<<< HEAD
    var resourcesImg=["end","grass","back","Logo","um","dois","tres","quatro","cinco","seis","umHover","doisHover","tresHover","quatroHover","cincoHover","seisHover","afonso","afonso1","background","box1","capitulo1","capitulo2","capitulo3","Creditos","CreditosHover","IronBar","Jogar","JogarHover","Keybinding","KeybindingHover","minus","minusHover","modo_classico","modo_classicoHover","modo_infinito","modo_infinitoHover","Opcao","OpcaoHover","plataforma","plus","plusHover","Som","SomHover","Voltar","VoltarHover","box2"]
	var	resourcesSound = ["levelButtonSound", "buttonSound"];
    var toLoad=resourcesImg.length + resourcesSound.length;
    var loaded=0;


    for(let i = 0, l = resourcesImg.length ; i < l ; i++){
=======
    var resourcesImg=["back","Logo","um","dois","tres","quatro","cinco","seis","umHover","doisHover","tresHover","quatroHover","cincoHover","seisHover","afonso","afonso1","background","box1","capitulo1","capitulo2","capitulo3","Creditos","CreditosHover","IronBar","Jogar","JogarHover","Keybinding","KeybindingHover","minus","minusHover","modo_classico","modo_classicoHover","modo_infinito","modo_infinitoHover","Opcao","OpcaoHover","plataforma","plus","plusHover","Som","SomHover","Voltar","VoltarHover","box2"]
	var	resourcesSound = ["levelButtonSound", "buttonSound"]
    var toLoad=resourcesImg.length + resourcesSound.lenght;
    var loaded=0;


    for(let i = 0, l = resourceImg.lenght ; i < l ; i++){
>>>>>>> 3656651d9c0ef8941b75b4ac52ee41ed53f76d5a
        let source=resourcesImg[i];
        let imagem=new Image();

        imagens[source]=imagem;
        imagem.id=source;
        imagem.addEventListener("load", resourcesLoadedHandler);
        imagem.src="../resources/"+source+".png";
    }

<<<<<<< HEAD
    for(let i = 0, l = resourcesSound.length ; i < l ; i++){
        let source = resourcesSound[i];
        let sound = new Audio();

        sounds[source] = sound;
        sound.id = source;
        sound.src = "../resources/sounds/" + source + ".mp3";
        resourcesLoadedHandler();
    }

=======
		for(let i = 0, l = resourcesSound.length ; i < l ; i++){
			let source = resourcesSound[i];
			let sound = new Audio();

			sounds[source] = sound;
			sound.id = source;
			sound.addEventListener("load", resourcesLoadedHandler)
			sound.src = "../resources/sounds/" + source + ".mp3";
		}

>>>>>>> 3656651d9c0ef8941b75b4ac52ee41ed53f76d5a
    function resourcesLoadedHandler(ev){
        loaded++;

        if(loaded==toLoad){
            console.log(imagens);
<<<<<<< HEAD
			console.log(sounds);
=======
						console.log(sounds);
>>>>>>> 3656651d9c0ef8941b75b4ac52ee41ed53f76d5a
            main(imagens, sounds);
        }
    }


}














/*
    var canvas=document.getElementById("canvas");
    var ctx=canvas.getContext("2d");
    var nw=canvas.width;
    var nh=canvas.height;

    var imagens=imagens;


    var assets=[];
    var asset=new Component(700,700,300,300,imagens.box2);
    var asset1=new Component(900,600,300,300,imagens.box1);
    var asset2=new Component(1150,500,300,300,imagens.box1);
    var asset3=new Component(100,850,300,40,imagens.plataforma);
    var asset4=new Component(400,850,300,40,imagens.plataforma);
    var asset5=new Component(400,400,100,100,imagens.box2);
    assets.push(asset);
    assets.push(asset1);
    assets.push(asset2);
    assets.push(asset3);
    assets.push(asset4);
    assets.push(asset5);

    var char=new Character(0,300,256,350,imagens.char,assets);


    //camera
    //var camera=new Camera(0,0,1066,600);
    var camera=new Camera(0,0,1600,900);
    var mapa = {x:0, y:0, width:1600, height:900};



    char.move(char,0,0,ctx);
    render();


    function render(){
        camera.updateAnim([asset,char,asset1,asset2,asset3,asset4,asset5],mapa,ctx);

        requestAnimationFrame(render);
    }
    */
