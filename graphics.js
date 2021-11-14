ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

let images = [
	'testDude.png',
	'testWall.png',

	'placeholderTextBox.png',

	'overworld/cia_agent.png',
	
	'overworld/mark/east/walk0.png',
	'overworld/mark/east/walk1.png',
	'overworld/mark/east/walk2.png',
	'overworld/mark/east/walk3.png',

	'overworld/mark/west/walk0.png',
	'overworld/mark/west/walk1.png',
	'overworld/mark/west/walk2.png',
	'overworld/mark/west/walk3.png',

	'overworld/mark/north/walk0.png',
	'overworld/mark/north/walk1.png',
	'overworld/mark/north/walk2.png',
	'overworld/mark/north/walk3.png',

	'overworld/mark/south/walk0.png',
	'overworld/mark/south/walk1.png',
	'overworld/mark/south/walk2.png',
	'overworld/mark/south/walk3.png',


	'overworld/owen/east/walk0.png',
	'overworld/owen/east/walk1.png',
	'overworld/owen/east/walk2.png',
	'overworld/owen/east/walk3.png',

	'overworld/owen/west/walk0.png',
	'overworld/owen/west/walk1.png',
	'overworld/owen/west/walk2.png',
	'overworld/owen/west/walk3.png',

	'overworld/owen/north/walk0.png',
	'overworld/owen/north/walk1.png',
	'overworld/owen/north/walk2.png',
	'overworld/owen/north/walk3.png',

	'overworld/owen/south/walk0.png',
	'overworld/owen/south/walk1.png',
	'overworld/owen/south/walk2.png',
	'overworld/owen/south/walk3.png',



	'battle/owen/idle.png',


	'battle/mark/idle.png',


	'battle/ciaAgent/idle.png',



	'backgrounds/test.png',
	'backgrounds/test2.png',


	'battle/backgrounds/road.png'

];

var graphics = {images:{}};

images.forEach((image)=>{
	graphics.images[image] = new Image();
	graphics.images[image].src = 'images/' + image;
});