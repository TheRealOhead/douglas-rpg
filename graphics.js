let images = ['placeholderTextBox.png'];

var graphics = {
	images:{

	}
};

images.forEach((image)=>{
	graphics.images[image] = new Image();
	graphics.images[image].src = 'images/' + image;
});