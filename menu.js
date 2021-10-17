var menu = {
	active:false,
	backgroundColor:'#229',
	borderColor:'#fff'
};

class Menu {
	constructor(position, arrayOfItems) {
		this.position = position;
		this.arrayOfItems = arrayOfItems;
	}

	display() {
		ctx.font = "16px MonospaceParker"; // My own font :D
		menu.active = true;
		ctx.fillStyle = menu.backgroundColor;
		ctx.strokeStyle = menu.borderColor;
		ctx.strokeRect(this.position.x,this.position.y,40,40);
		ctx.fillRect(this.position.x,this.position.y,40,40);
	}
}

class MenuItem {
	constructor(content, func) {
		this.content = content;
		this.func = func;
	}
}