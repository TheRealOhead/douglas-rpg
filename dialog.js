  //////////
 // INIT //
//////////

var dialog = {
	textSpeed: 10, // Higher is slower
	startCoords: [208,330],
	charactersPerLine: 42,
	pixelsBetweenLines: 22,
	audioDelay:4, // Only play text beep every N characters
	textActive: false,
	currentlyTyping: false,
	textColor:'#000',

	head:{
		startCoords: [40,320]
	},

	say:(dialogList)=>{
		dialogList.render();
	}
};


  ////////////////
 // CLASS LIST //
////////////////


/*
* Used to store data for a single textbox worth of dialog
* @param {string} content What the character should say
* @param {string} speaker Who is to say it
*/
class Dialog {
	constructor(content, speaker, emotion) {
		this.content = content;
		this.speaker = speaker;
		this.emotion = emotion;

		// This makes it easier to render out sequentally
		this.contentArray = content.split('');
	}

	/* 
	* Render out all the letters
	*/
	render() {
		// Render text box
		ctx.drawImage(graphics.images['placeholderTextBox.png'], 0, c.height - graphics.images['placeholderTextBox.png'].height);

		// Render face
		let face = new Image();
		face.src = 'images/dialogFaces/' + this.speaker + '/' + this.emotion + '.png';
		
		// Wait for image to load
		face.addEventListener('load',()=>{

			face.style.imageRendering = 'pixelated';

			let index = 0;

			// Turn on currentlyTyping
			dialog.currentlyTyping = true;

			// Draw the now-loaded face
			ctx.drawImage(face,dialog.head.startCoords[0],dialog.head.startCoords[1],96,96);

			this.renderCallback(index);

		});
	}
	renderCallback(index) {

		if (index < this.contentArray.length) {
			ctx.font = "16pt MonospaceParker"; // My own font :D

			if (index % dialog.audioDelay == 0) {
				audio.sounds['textBeep.wav'].pause();
				audio.sounds['textBeep.wav'].currentTime = 0;
			};

			// BLACK BOX #1 LMAOOOOOOOOOOOOO
			ctx.fillStyle = dialog.textColor;
			ctx.fillText(this.content.substr(index,1),
				((index * 13)) % (dialog.charactersPerLine * 13) + dialog.startCoords[0],Math.floor(index / dialog.charactersPerLine) * dialog.pixelsBetweenLines + dialog.startCoords[1]);
			
			if (index % dialog.audioDelay == 0) {
				audio.sounds['textBeep.wav'].play();
			};
			
			index++;

			if (dialog.textActive) // Make sure the text box is still active
				setTimeout(()=>{this.renderCallback(index)},dialog.textSpeed);
		} else {
			// Turn off currentlyTyping
			dialog.currentlyTyping = false;
		};
	}
}


/*
* A string of dialog boxes to show in a sequence
* @param {Dialog[]} list The sequence of Dialogs to show
*/
class DialogList {
	constructor(list,callback) {
		this.list = list;
		if (!callback) {
			this.callback = ()=>{};
		} else {
			this.callback = callback;
		};
	}

	/*
	* Render out all the text boxes!
	*/
	render() {
		dialog.textActive = true;

		// To keep track
		let index = 0;

		// Function to be used for the " " event
		let eventFunc = (e)=>{
			if (e.key == ' ' && !dialog.currentlyTyping) {
				document.removeEventListener('keydown',eventFunc);
				loop();
			};
		};

		// Recursive function
		let loop = () => {

			// Render current text box
			this.list[index].render();

			// Increment
			index++;

			// Only recurse if there are more text boxes to do
			if (index < this.list.length) {
				document.addEventListener('keydown',eventFunc);

				// If it's the first text box, send a fake " "
				if (index == 0)
					eventFunc({key:' '});
			} else {
				// Closes the last text box
				let enderFunc = (e) => {
					if (e.key == ' ') {
						dialog.textActive = false;
						document.removeEventListener('keydown',enderFunc);
						this.callback()
					};
				};
				document.addEventListener('keydown',enderFunc);
			};
		};

		// Begin the loop
		loop();
	}
}

/// DEBUG POGGGGGGGG
/*graphics.images['placeholderTextBox.png'].addEventListener('load',()=>{

	let d = new DialogList([
	new Dialog('Hello, my name is Mark Bellenoit!','mark','regular'),
	new Dialog('Hang on a minute...','mark','sussy'),
	new Dialog('Am I in a video game?!','mark','omg'),
	new Dialog('I\'ll destroy you, Owen Parker! They will never find your remains! I\'m gonna chop you up and put you underneath the floorboards!','mark','angry')
	]);

	d.render();

});*/