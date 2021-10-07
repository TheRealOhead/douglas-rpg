  //////////
 // INIT //
//////////

var dialog = {
	textSpeed: 40, // Higher is slower
	startCoords: [208,330],
	charactersPerLine: 42,
	pixelsBetweenLines: 22
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
	constructor(content, speaker) {
		this.content = content;
		this.speaker = speaker;

		// This makes it easier to render out sequentally
		this.contentArray = content.split('');
	}

	/* TODO
	* Render out all the letters
	*/
	render() {
		// Render text box
		ctx.drawImage(graphics.images['placeholderTextBox.png'], 0, c.height - graphics.images['placeholderTextBox.png'].height);

		let index = 0;
		this.renderCallback(index);
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
		// To keep track
		let index = 0;

		// Function to be used for the "Enter" event
		let eventFunc = (e)=>{
			if (e.key == 'Enter') {
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
			};
		};

		// Begin the loop
		loop();
	}
}