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
	zoom:2,
	partyTrail:{
		limit:300,
		trail:[],
		members:[]
	}
}

// Fill the trail
for (let i = 0; i < overworld.partyTrail.trail.length; i++) {
	overworld.partyTrail.trail.push(new PartyPosition(undefined,undefined,'south'))
};

function getMark() {
	let mark = null;
	overworld.things.forEach((t)=>{
		if (t.name == 'mark') {
			mark = t;
		};
	});
	return mark;
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

	// Remove self from list of things
	remove() {
		overworld.things.forEach((thing,i)=>{
			if (this == thing) {
				overworld.things.splice(i);
			};
		});
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
	constructor(x, y, width, height, collision, name, interact, facing, animationDelay) {
		super(x,y,width,height,collision,interact);
		
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
		super(x,y,undefined,undefined,false);
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


			// Party stuff
			if (this.walking) {// Only while walking!
				overworld.partyTrail.trail.unshift(new PartyPosition(JSON.parse(JSON.stringify(this.position)), this.facing));
				if (overworld.partyTrail.trail.length > overworld.partyTrail.limit) {
					overworld.partyTrail.trail.pop();
				};
			};

			if (callback)
				callback();
		});
	}
}

class PartyPosition {
	constructor(position,facing) {
		this.position = position;
		this.facing = facing;
	}
}

class PartyMember extends Person {
	constructor(name) {
		super(undefined, undefined, undefined, undefined, false, name, (()=>{}));
	}
}




overworld.things = [
	new Mark(350,350),
	new Object(300,500,128,128,true,()=>{
		new Menu({x:20,y:20},[
			new MenuItem('Talk',()=>{
				let d = new DialogList([
					new Dialog('Welcome to the test room!','testDude','happy'),
					new Dialog('What the hell is that?!','mark','angry'),
					new Dialog('It\'s a room that a developer, (Owen, in this case), uses to test features in a video game.','testDude','happy'),
					new Dialog('Why are our words cut off at strange places?','mark','sussy'),
					new Dialog('Owen is a lazy fucker!','testDude','happy'),
				]);
				dialog.say(d);
			}),
			new MenuItem('Punch',()=>{
				let d = new DialogList([
					new Dialog('Hey! That smarts!','testDude','sad')
				]);
				dialog.say(d);
			})
		]).open();
	},'testDude.png'),
	new Object(600,500,32 * 2,48 * 2,true,()=>{
		let d = new DialogList([
			new Dialog('Sorry kid, can\'t let you though. Federally classified.','ciaAgent','stern')
		]);
		dialog.say(d);
	},'overworld/cia_agent.png'),
	new Person(20,20,undefined,undefined,true,'owen',()=>{
		new Menu({x:20,y:20},[
			new MenuItem('Recruit',()=>{
				let d = new DialogList([
					new Dialog('You want me to join your cause? Sure, why not?','owen','happy')
				],()=>{overworld.partyTrail.members.push({
					partyMember: new PartyMember('owen'),
					distance:35
				});
			});
				dialog.say(d);
			})
		]).open();
	})
];

/*overworld.partyTrail.members = [
	{
		partyMember: new PartyMember('owen'),
		distance:35
	},
	{
		partyMember: new PartyMember('owen'),
		distance:70
	}
]*/













// Main loop, used for both rendering and logic
// Will not be executed during dialog
setInterval(()=>{
	if (!dialog.textActive && !menu.active && !battle.active) {

		  ///////////////
		 // RENDERING //
		///////////////

		// Draw background
		ctx.drawImage(overworld.background,-overworld.scroll.x,-overworld.scroll.y,overworld.background.width * overworld.zoom,overworld.background.height * overworld.zoom);


		// Render all the things
		overworld.things.forEach((t)=>{
			t.render();

		});
		// Also render party members!
		overworld.partyTrail.members.forEach((member)=>{
			// Set their location to where they're supposed to be
			if (overworld.partyTrail.trail.length > member.distance) {
				member.partyMember.position = overworld.partyTrail.trail[member.distance].position;
				member.partyMember.facing = overworld.partyTrail.trail[member.distance].facing;
			};
			member.partyMember.walking = getMark().walking;
			member.partyMember.render();
		});


		  ///////////
		 // LOGIC //
		///////////
		overworld.things.forEach((t)=>{
			t.update();
		});

	};
},10)