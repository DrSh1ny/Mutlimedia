"use strict";

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
            //drawElements(ctx,mainMenu(canvas,elementos,imagens),imagens);
            
            setCookie(sounds.shout.volume,canvas.keys.jump,canvas.keys.left,canvas.keys.right,canvas.keys.attack,canvas.framerate,0);
            
        }
    }

    
    canvas.addEventListener("mousemove",mouseMoveHandler);
    canvas.addEventListener("click",keyClickHandler);
    document.addEventListener("keyup", keyUpHandler);
    

    return mainMenu(canvas,elementos,imagens);
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
