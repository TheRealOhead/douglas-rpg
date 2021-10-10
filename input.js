var input = {
	keys:[],
	isKeyDown:(key)=>{
		return input.keys.includes(key);
	},
	debug:false // Shows button presses in console
}




// Key down
document.addEventListener('keydown',(e)=>{
	let key = e.key;

	// If it's not already in the array, add it!
	if (!input.keys.includes(key)) {
		input.keys.push(key);
	};

	if (input.debug) // Debug stuff!
		console.log(key);
});


// Key up
document.addEventListener('keyup',(e)=>{
	let key = e.key;

	// Remove all instances of the key in the array (there should only be one, but better safe than sorry!)
	while (input.keys.includes(key)) {
		// Go through backwards
		for (let i = input.keys.length - 1; i >= 0; i--) {
			if (input.keys[i] == key) {
				input.keys.splice(i,1);
			};
		};
	};
});




// DEBUG :DDD
/*let x = document.createElement('x');
document.body.appendChild(x)

setInterval(()=>{
	x.innerHTML = input.keys;
},10);*/