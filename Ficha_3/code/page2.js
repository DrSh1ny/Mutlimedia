"use strict";


const opacDisabled = 0.3;  //transparência para botões desactivados
const imgFolder = "../resources/image/";
const txtFolder = "../resources/text/";
const audioVolume = 1;


(function()
{
	window.addEventListener("load", main);
}());






function main()
{
	var ID;
	var currentPage = 1;
	var buttons = document.getElementsByTagName("button");
	var data;
	document.getElementsByTagName("audio")[0].play();

	var listener = function (ev){

		currentPage=eventHandler(ev,currentPage,buttons,listener,ID);
	}


	buttons[0].addEventListener("click", listener);
	buttons[1].addEventListener("click", listener);
	buttons[2].addEventListener("click", listener);
	buttons[3].addEventListener("click", listener);
	buttons[4].addEventListener("click", listener);
	buttons[5].addEventListener("click", listener);



	disable(buttons,listener,currentPage,0);
	showPage(currentPage, buttons, listener)

}


function showPage(currentPage){
	var text = document.getElementById("text");
	var image = document.getElementById("photo");
	if(currentPage < 10){
		text.src = txtFolder + "0" + currentPage + ".txt";
		image.src = imgFolder + "0" + currentPage + ".jpg";
	}
	else{
		text.src = txtFolder + currentPage + ".txt";
		image.src = imgFolder + currentPage + ".jpg";
	}


}


function backToStart(){
	var currentPage = 1;
	showPage(currentPage);
	return currentPage;
}


function toTheEnd(buttons, listener){
	var currentPage = 16;
	showPage(currentPage, buttons, listener);

	return currentPage;
}

function nextSlide(currentPage, buttons, listener){
	currentPage += 1;
	showPage(currentPage, buttons, listener);
	return currentPage;
}

function previousSlide(currentPage, buttons, listener){
	currentPage -= 1;
	showPage(currentPage, buttons, listener);
	return currentPage;
}



function slideShow(newFunction){
	newFunction();
	var ID = window.setInterval(newFunction,2000);
	return ID;

}

function sound(ev){
	var backsound = document.getElementsByTagName("audio");

	if(backsound[0].volume == 0){
		ev.target.src="../resources/extra/soundOnBtn.png";
		backsound[0].volume = 1;
	}
	else{
		ev.target.src="../resources/extra/soundOffBtn.png";
		backsound[0].volume = 0;
	}

}

function eventHandler(ev,currentPage,buttons,listener,ID){

	var button = ev.currentTarget.id;
	if(button == buttons[0].id){
		currentPage = backToStart(buttons, listener);
		disable(buttons, listener,currentPage,0);
	}
	else if(button == buttons[1].id){
		currentPage = previousSlide(currentPage, buttons, listener);
		disable(buttons, listener,currentPage,0);
	}
	else if(button == buttons[2].id){
		currentPage = nextSlide(currentPage, buttons, listener);
		disable(buttons, listener,currentPage,0);
	}
	else if(button == buttons[3].id){
		currentPage = toTheEnd(buttons, listener);
		disable(buttons, listener,currentPage,0);
	}
	else if(button == buttons[4].id){

		var newFunction = function(){


			if(currentPage != 16){
				currentPage = nextSlide(currentPage,buttons,listener);
				disable(buttons,listener,currentPage,1);
			}else{
				clearInterval(ID);
				disable(buttons,listener,currentPage,0)
			}

		}

		ID = slideShow(newFunction);

		document.onkeydown = function(e) {
			if(e.keyCode == 27){
				clearInterval(ID);
				buttons[0].style.opacity = 1;
				buttons[0].addEventListener("click", listener);
				buttons[1].style.opacity = 1;
				buttons[1].addEventListener("click", listener);
				buttons[2].style.opacity = 1;
				buttons[2].addEventListener("click", listener);
				buttons[3].style.opacity = 1;
				buttons[3].addEventListener("click", listener);
			}
			console.log(currentPage);
		}
	}
	else if(button == buttons[5].id){
		sound(ev)
	}
	return currentPage;

}

function disable(buttons,listener,currentPage, slideShow = 0){
	if(slideShow){
		buttons[0].style.opacity = 0.3;
		buttons[0].disabled=true;
		buttons[0].style.cursor="initial";
		buttons[1].style.opacity = 0.3;
		buttons[1].disabled=true;
		buttons[1].style.cursor="initial";
		buttons[2].style.opacity = 0.3;
		buttons[2].disabled=true;
		buttons[2].style.cursor="initial";
		buttons[3].style.opacity = 0.3;
		buttons[3].disabled=true;
		buttons[3].style.cursor="initial";


	}else{
		if(currentPage == 1){
			buttons[0].style.opacity = 0.3;
			buttons[0].disabled=true;
			buttons[0].style.cursor="initial";
			buttons[1].style.opacity = 0.3;
			buttons[1].disabled=true;
			buttons[1].style.cursor="initial";

			buttons[2].style.opacity = 1;
			buttons[2].disabled=false;
			buttons[2].style.cursor="pointer";

			buttons[3].style.opacity = 1;
			buttons[3].disabled=false;
			buttons[3].style.cursor="pointer";

		}
		else if(currentPage == 16){
			buttons[2].style.opacity = 0.3;
			buttons[2].disabled=true;
			buttons[2].style.cursor="initial";
			buttons[3].style.opacity = 0.3;
			buttons[3].disabled=true;
			buttons[3].style.cursor="initial";

			buttons[0].style.opacity = 1;
			buttons[0].disabled=false;
			buttons[0].style.cursor="pointer";
			buttons[1].style.opacity = 1;
			buttons[1].disabled=false;
			buttons[1].style.cursor="pointer";
		}
		else{
			buttons[0].style.opacity = 1;
			buttons[0].disabled=false;
			buttons[0].style.cursor="pointer";
			buttons[1].style.opacity = 1;
			buttons[1].disabled=false;
			buttons[1].style.cursor="pointer";
			buttons[2].style.opacity = 1;
			buttons[2].disabled=false;
			buttons[2].style.cursor="pointer";
			buttons[3].style.opacity = 1;
			buttons[3].disabled=false;
			buttons[3].style.cursor="pointer";
		}
	}
}
