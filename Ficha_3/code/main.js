"use strict";

const totPages = 3;

(function()
{
	window.addEventListener("load", main);
}());


function main()
{
	var btn = document.getElementsByTagName("button")[0];
	btn.addEventListener("click", btnNextPageHandler);  //escutar clicks no botão de navegação

	var startPage = 1;
	showPage(startPage);

	window.addEventListener("message",messageReceived);
}



//---- Navegação e gestão de janelas
function showPage(pageNum)
{
	//carregar página na frame e enviar mensagem para a página logo que esteja carregada (frameLoadHandler)
	var frm = document.getElementsByTagName("iframe")[0];
	frm.src = "page" + pageNum + ".html";


	if(pageNum == totPages) //se última, esconder botão de navegação
	{
		var btn = document.getElementsByTagName("button")[0];
		btn.style.visibility = "hidden";
		btn.removeEventListener("click", btnNextPageHandler);  //remover clicks no botão de navegação
	}

}

function hidePage(pageNum)  //não é necessário (excepto se páginas diferentes tivessem zonas de navegação diferentes)
{
	var frm = document.getElementsByTagName("iframe")[0];
	frm.src = "";
}

function btnNextPageHandler(ev)
{
	var frm = document.getElementsByTagName("iframe")[0];
	var frmName = frm.src;
	var pageNum = Number(frmName.charAt(frmName.length - 6));  //e.g., page2.html --> get the number 2

	hidePage(pageNum);
	showPage(pageNum + 1);
}



function messageReceived(ev) {
	if(ev.data=="Ended 1"){
		showPage(2);
	}
}
