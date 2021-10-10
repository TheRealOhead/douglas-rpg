ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

let images = [
	'testDude.png',
	'testWall.png',

	'placeholderTextBox.png',
	
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

	'backgrounds/test.png',
	'backgrounds/test2.png'

];

var graphics = {images:{}};

images.forEach((image)=>{
	graphics.images[image] = new Image();
	graphics.images[image].src = 'images/' + image;
});