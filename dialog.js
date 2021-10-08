  //////////
 // INIT //
//////////

var dialog = {
	textSpeed: 40, // Higher is slower
	startCoords: [208,330],
	charactersPerLine: 42,
	pixelsBetweenLines: 22,
	textActive: false,
	currentlyTyping: false,

	head:{
		startCoords: [40,320]
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

	/* TODO
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

			// BLACK BOX #1 LMAOOOOOOOOOOOOO
			ctx.fillText(this.content.substr(index,1),
				((index * 13)) % (dialog.charactersPerLine * 13) + dialog.startCoords[0],Math.floor(index / dialog.charactersPerLine) * dialog.pixelsBetweenLines + dialog.startCoords[1]);
			
			index++;
			audio.sounds['textBeep.wav'].play();
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
	constructor(list) {
		this.list = list;
	}

	/*
	* Render out all the text boxes!
	*/
	render() {
		dialog.textActive = true;

		// To keep track
		let index = 0;

		// Function to be used for the "Enter" event
		let eventFunc = (e)=>{
			if (e.key == 'Enter' && !dialog.currentlyTyping) {
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

				// If it's the first text box, send a fake "Enter"
				if (index == 0)
					eventFunc({key:'Enter'});
			} else {
				// Closes the last text box
				let enderFunc = (e) => {
					if (e.key == 'Enter') {
						dialog.textActive = false;
						document.removeEventListener('keydown',enderFunc);
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
alert('Press ENTER to proceed through text');
graphics.images['placeholderTextBox.png'].addEventListener('load',()=>{

	let d = new DialogList([
	new Dialog('Hello, my name is Mark Bellenoit!','mark','regular'),
	new Dialog('Hang on a minute...','mark','sussy'),
	new Dialog('Am I in a video game?!','mark','omg'),
	new Dialog('I\'ll destroy you, Owen Parker! They will never find your remains! I\'m gonna chop you up and put you underneath the floorboards!','mark','angry')
	]);

	d.render();

});