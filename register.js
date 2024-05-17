// function isInputNumber(evt){

// 	var char = String.fromCharCode(evt.which);

// 	if(!(/[a-z]/.test(char))){
// 		evt.preventDefault();
// 	}

// }

// function inputeng(e){

// 	var char = e.target.value.split('');
// 	if(!(/[a-zA-Z]/.test(char))){
// 		e.target.value = chars.join('');
// 		console.log('${char} is not a valid character');
// 	}
// }

// document.querySelector('#username').addEventListener('onchange',inputeng);

window.onload = function(){
	document.getElementById('#username').addEventListener('input',function(){
		this.value = this.value.replace(/[^\x00-\x7F]+/ig, '');
	})
}


