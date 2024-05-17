$(function(){

	var a = $('.colpse-handle').click().val();
	var b = $('.tool').click().val();

	$('.colpse-handle').click(function(){
		a++;
		if(a%2==1){
			$('.sidetool').addClass('fixed');
		}
		else{
			$('.sidetool').removeClass('fixed');
		}
		console.log(a);
	})

	$('.tool').click(function(){

		b++;
		if(a%2==1){
			$('li').css('background-color','black;')
		}

	})

})


// var a=0;
// function ease(){

// 	document.getElementById('ease').animation()
 
// 	a++;
// 	console.log(a);

// }
