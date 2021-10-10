/*
*
* I'm apologise, it's a mit messy in here :,)
*
*/

var overworld = {

}


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
	constructor(x, y, width, height, collision, image) {
		super(x,y,width,height);
		this.image = image;
		this.collision = collision;
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
		super(x,y,width,height,false);
		
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
		super(x,y);
		this.speed = 5;
	}

	update(callback) {
		super.update(()=>{

			// Walking logic
			let desiredVector = {x:0,y:0};

			if (input.isKeyDown('w') || 
				input.isKeyDown('s') || 
				input.isKeyDown('a') || 
				input.isKeyDown('d')) {

				this.walking = true;

				if (input.isKeyDown('a')) {
					this.facing = 'west';
					desiredVector.x = -1;
				};
				if (input.isKeyDown('d')) {
					this.facing = 'east';
					desiredVector.x = 1;
				};
				if (input.isKeyDown('w')) {
					this.facing = 'north';
					desiredVector.y = -1;
				};
				if (input.isKeyDown('s')) {
					this.facing = 'south';
					desiredVector.y = 1;
				};
			} else {
				this.walking = false;
			};

			// Check y collision
			let prePosition = JSON.parse(JSON.stringify(this.position));

			this.position.x += desiredVector.x * this.speed;
			this.position.y += desiredVector.y * this.speed;






			if (callback)
				callback();
		});
	}
}










overworld.things = [
	new Object(0,0,0,0,false,'testDude.png'),
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
		overworld.things.forEach((t)=>{
			t.render();
		});


		  ///////////
		 // LOGIC //
		///////////
		overworld.things.forEach((t)=>{
			t.update();
		});

	};
},10)