/*
*
* I'm apologise, it's a mit messy in here :,)
*
*/

var overworld = {
	scroll:{
		x:0,
		y:0
	},
	background:graphics.images['backgrounds/test.png'],
	zoom:2
}

    ////////////////////////
   ////////////////////////
  ///////  CLASSES ///////
 ////////////////////////
////////////////////////


class Thing {
	constructor(x, y, width, height) {
		this.position = {
			x: x,
			y: y
		};
		this.collisionBox = {
			width:  32,
			height: 32
		};
		if (width || height) {
			this.collisionBox = {
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

  ////////////////
 // This is to be used for everything that isn't a part of the background, I'll make a separate system for that at some point :)))
////////////////
class Object extends Thing {
	constructor(x, y, width, height, collision, interact, image) {
		super(x,y,width,height);
		this.image = image;
		this.collision = collision;
		if (interact)
			this.interact = interact;
	}

	render() {
		let image = graphics.images[this.image];
		ctx.drawImage(image,this.position.x - overworld.scroll.x,this.position.y - overworld.scroll.y,image.width * overworld.zoom,image.height * overworld.zoom);
	}
}

  ////////////////
 // Used for party members, NPCs, and Mark
////////////////
class Person extends Object {
	constructor(x, y, width, height, name, interact, facing, animationDelay) {
		super(x,y,width,height,false,interact);
		
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
		this.speed = 2;

		this.pressedSpaceLastFrame = false;
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

			// Fun fact for all you nerds who actually are seeing this:
			// I got the idea for this type of collision checking from the way Super Mario 64 does it,
			// just with one less dimension!

			let checkCollision = (dimension) => {
				let prePosition = JSON.parse(JSON.stringify(this.position));

				this.position[dimension] += desiredVector[dimension] * this.speed;

				let goBack = false;
				overworld.things.forEach((o)=>{
					if (o.collision && collision(this,o)) {
						goBack = true;
					};
				});
				if (goBack) 
					this.position = JSON.parse(JSON.stringify(prePosition));
			};

			// Check x collision
			checkCollision('x');

			// Check y collision
			checkCollision('y');



			// Set scroll to Mark himself
			overworld.scroll.x = this.position.x - c.width  / 2 + this.collisionBox.width  / 2;
			overworld.scroll.y = this.position.y - c.height / 2 + this.collisionBox.height / 2;

			// If scroll is beyond background boundary, stop it!
			if (overworld.scroll.x < 0)
				overworld.scroll.x = 0;
			if (overworld.scroll.y < 0)
				overworld.scroll.y = 0;
			if (overworld.scroll.x > overworld.background.width * 2 - c.width)
				overworld.scroll.x = overworld.background.width * 2 - c.width;
			if (overworld.scroll.y > overworld.background.height * 2 - c.height)
				overworld.scroll.y = overworld.background.height * 2 - c.height;


			// Handle interaction
			if (!this.pressedSpaceLastFrame && input.isKeyDown(' ')) {
				let interact = ()=>{};

				// Get the point to check for things from Mark
				let interactPoint = {x:this.position.x + this.collisionBox.width / 2,y:this.position.y + this.collisionBox.height / 2}; // Center
				switch (this.facing) {
					case 'north':
						interactPoint.y -= this.collisionBox.height;
						break;
					case 'south':
						interactPoint.y += this.collisionBox.height;
						break;
					case 'east':
						interactPoint.x += this.collisionBox.width;
						break;
					case 'west':
						interactPoint.x -= this.collisionBox.width;
						break;
				};

				overworld.things.forEach((thing)=>{
					// Check for point collision
					if (thing.interact &&
						interactPoint.x > thing.position.x &&
						interactPoint.y > thing.position.y &&
						interactPoint.x < thing.position.x + thing.collisionBox.width &&
						interactPoint.y < thing.position.y + thing.collisionBox.height) {
						interact = thing.interact;
					};
				});

				interact();
			};
			this.pressedSpaceLastFrame = input.isKeyDown(' ');

			if (callback)
				callback();
		});
	}
}




overworld.things = [
	new Mark(350,350),
	new Object(300,500,128,128,true,()=>{
		let d = new DialogList([
			new Dialog('Welcome to the test room!','testDude','happy'),
			new Dialog('What the hell is that?!','mark','angry'),
			new Dialog('It\'s a room that a developer, (Owen, in this case), uses to test features in a video game.','testDude','happy'),
			new Dialog('Why are our words cut off at strange places?','mark','sussy'),
			new Dialog('Owen is a lazy fucker!','testDude','happy'),
		]);
		dialog.say(d);
	},'testDude.png')
];













// Main loop, used for both rendering and logic
// Will not be executed during dialog
setInterval(()=>{
	if (!dialog.textActive) {

		  ///////////////
		 // RENDERING //
		///////////////

		// Draw background
		ctx.drawImage(overworld.background,-overworld.scroll.x,-overworld.scroll.y,overworld.background.width * overworld.zoom,overworld.background.height * overworld.zoom);


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