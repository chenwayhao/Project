$(function(){

	var a=0;
	$('#show').click(function(e){
		a++;
		if(a%2==0)
			$('#password').get(0).type='text';
		else
			$('#password').get(0).type='password';

	})

	$('#username').keypress(function(e){
		var char = event.which;
		// console.log(char);
		if(char==32)
			return true;
		if(char>=48 && char<=57)
			return true;
		if(char>=65 && char<=90)
			return true;
		if(char>=97 && char<=122)
			return true;
		else{
			return false;
		}
	});

});