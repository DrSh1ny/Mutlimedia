"use strict";


class Monster{

  constructor(){
    this.state=0; // 0->normal 1->scared
    this.sprite="../Experimental/images/monsterStates.png";
    this.image=new Image();
    this.image.src=this.sprite;

  }

displayState(){
  switch (this.state) {
    case 0:
      console.log("The mosnter is OK");
      break;
    case 1:
      console.log("The mosnter is scared");
      break;
    default:
      console.log("Oops. Something wrong!");
      break;
  }
}

changeState(){
  switch (this.state) {
    case 0:
      this.state=1;
      break;
    case 1:
      this.state=0;
      break;
    default:
      console.log("Oops something wrong!");
  }
}

render(context,image,state){
    window.requestAnimationFrame();
    context.clearRect(0, 0, 64, 64);
    image.onload=function(){
    context.drawImage(image,64*state, 0, 64, 64,0, 0, 64, 64);
  }

}
}
