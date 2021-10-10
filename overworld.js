/*
*
* I'm apologise, it's a mit messy in here :,)
*
*/

class Thing {
	constructor(x, y, width, height) {
		this.position = {
			x: x,
			y: y
		};
		this.collision = {
			width:  64,
			height: 64
		};
		if (width) {
			this.collision = {
				width:  width,
				height: height
			};
		};
	}


	// Move the thing smoothly, ignoring collision entirely
	move(dx,dy,time,callback) {
		let steps = time / 10;
		let inc = 0;
		let loop = () => {
			this.position.x += dx / steps;
			this.position.y += dy / steps;
			inc++;

			// Only go steps times
			if (inc < steps) {
				setTimeout(loop,10);
			} else {
				if (callback) {
					callback();
				};
			};
		};

		loop();
	}

	// Same as above, but with absolute positions
	moveTo(x,y,time,callback) {
		this.move(x - this.position.x,y - this.position.y,time,callback);
	}

	render() {
	}

	update(callback) {
		if (callback)
			callback();
	}
}

    ////////////////////////
   ////////////////////////
  ///////  CLASSES ///////
 ////////////////////////
////////////////////////

  ////////////////
 // This is to be used for everything that isn't a part of the background, I'll make a separate system for that at some point :)))
////////////////
class Object extends Thing {
	constructor(x, y, width, height, image) {
		super(x,y,width,height);
		this.image = image;
	}

	render() {
		// TODO: Account for scrolling
		let image = graphics.images[this.image];
		ctx.drawImage(image,this.position.x,this.position.y,image.width * 4,image.height * 4);
	}
}

  ////////////////
 // Used for party members, NPCs, and Mark
////////////////
class Person extends Object {
	constructor(x, y, width, height, name, facing, animationDelay) {
		super(x,y,width,height);
		
		!name   		   ? this.name           = 'mark'  : this.name           = name;
		!facing 		   ? this.facing         = 'south' : this.facing         = facing;
		!animationDelay    ? this.animationDelay = 20      : this.animationSpeed = animationSpeed;

		this.animationState = 0; // Basically for walking png file finding
		this.animationTimer = 0; // Goes up to this.aminationDelay
		this.walking = false;    // Whether or not they're walking
		
		this.walkingStateTotal = 4;

		this.customImage = undefined;
	}

	render() {
		if (!this.walking) {
			// Standing
			this.animationTimer = 0;
			this.animationState = 0;
		} else {
			// Walking
			this.animationTimer++;
			if (this.animationTimer >= this.animationDelay) {
				this.animationState = (this.animationState + 1) % this.walkingStateTotal;
				this.animationTimer = 0;
			};
		};


		this.image = 'overworld/' + this.name + '/' + this.facing + '/walk' + this.animationState + '.png';
		if (this.customImage) 
			this.image = this.customImage;


		super.render();
	}
}

  /////////////////
 // The Player! //
/////////////////
class Mark extends Person {
	constructor(x, y) {
		super(x,y)
	}

	update(callback) {
		super.update(()=>{

			// Walking logic
			if (input.isKeyDown('w') || 
				input.isKeyDown('s') || 
				input.isKeyDown('a') || 
				input.isKeyDown('d')) {

				this.walking = true;

				if (input.isKeyDown('w')) {
					this.facing = 'north';
				};
				if (input.isKeyDown('s')) {
					this.facing = 'south';
				};
				if (input.isKeyDown('a')) {
					this.facing = 'west';
				};
				if (input.isKeyDown('d')) {
					this.facing = 'east';
				};

			} else {
				this.walking = false;
			};

			if (callback)
				callback();
		});
	}
}


var things = [
	new Object(0,0,0,0,'testDude.png'),
	new Mark(200,200)
];


// Main loop, used for both rendering and logic
// Will not be executed during dialog
setInterval(()=>{
	if (!dialog.textActive) {

		  ///////////////
		 // RENDERING //
		///////////////

		// Clear the screen
		// TODO: Change to drawBackground
		ctx.fillStyle = '#fff';
		ctx.fillRect(0,0,c.width,c.height);


		// Render all the things
		things.forEach((t)=>{
			t.render();
		});


		  ///////////
		 // LOGIC //
		///////////
		things.forEach((t)=>{
			t.update();
		});

	};
},10)