'use strict';

(function()
  {
    window.addEventListener("load", main);
  }()
);



function main(){
  var t = new Level();
  t.loadLevel("level_file_example.json");

  //print the characters coordinates
  document.write("character's x: " + t.charx + "<br>" + "character's y: " + t.chary + "<br>");
  //print what is inside the sprites array from the Level object
  document.write("Level's sprite matrix that contains the numbers associated to a certain sprite at a certain (e,i) position<br>'e' being the column number and 'i' the line number of the matrix<br>");
  for (let i = 0; i < t.sprites.length; i++){
    for (let e = 0; e < t.sprites[0].length ; e++){
      document.write(t.sprites[i][e] + " ");
    }
    document.write("<br>");
  }

}
