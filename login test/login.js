$(function(){

	var a=0;
	$('#show').click(function(e){
		a++;
		if(a%2==0)
			$('#password').get(0).type='text';
		else
			$('#password').get(0).type='password';

	})

});
