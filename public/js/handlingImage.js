
handleGif=function(){
  flower=document.getElementById('AnimatedFlower');
  flower.onclick=displayGif;
};
displayGif=function(){
  flower.style.visibility='hidden';
  setTimeout(function(){flower.style.visibility='visible'},1000);
}
window.onload=handleGif;
