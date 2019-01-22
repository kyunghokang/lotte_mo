var colorCode = function(){
  return "#"+((1<<24)*Math.random()|0).toString(16);
}

window.addEventListener( 'load' , function () {
	var list = document.querySelectorAll(".view ul li");
	
	Array.prototype.forEach.call(list , function(element, index){
		element.style.background = colorCode();	
	});


	console.log( 1<<1 ) ; 
}) ; 