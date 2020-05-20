"use strict"

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
    
    if(slide==-1 && comecar.mouseOverBoundingBox(ev)){
        canvas.removeEventListener("mousemove",evL1);
        som.currentTime=1;
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
        som.pause();
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