var menu = {
	active:false,
	backgroundColor:'#229',
	borderColor:'#fff',
	selectedItem:0,
	fontSize:16
};

class Item {
	constructor(type) {
		this.type = type;
	}
};

class Weapon extends Item {
	constructor(type, damage) {
		super(type);
		this.damage = damage;
	}
};

class MeleeWeapon extends Weapon {
	constructor(damage) {
		super('meleeWeapon', damage);
	}
}

var items = {
	'gavel':new MeleeWeapon(4)
};

var inventory = [
	'gavel'
];

class Menu {
	constructor(position, arrayOfItems) {
		this.position = position;
		this.arrayOfItems = arrayOfItems;
		this.arrayOfItems.push(new MenuItem('Cancel',()=>{}));
	}

	open() {
		menu.selectedItem = 0;
		this.display();

		// Functions used for changing menu items
		let up = (e)=>{
			if (e.key == 'w') {
				audio.sounds['menuMove.wav'].play();
				menu.selectedItem--;
				if (menu.selectedItem < 0)
					menu.selectedItem = this.arrayOfItems.length - 1;
				this.display();
			};
		};

		let down = (e)=>{
			if (e.key == 's') {
				audio.sounds['menuMove.wav'].play();
				menu.selectedItem++;
				if (menu.selectedItem >= this.arrayOfItems.length)
					menu.selectedItem = 0;
				this.display();
			};
		};

		let confirm = (e)=>{ // Activate current menu item
			if (e.key == ' ') {
				menu.active = false;

				document.removeEventListener('keydown',down);
				document.removeEventListener('keydown',up);
				document.removeEventListener('keydown',confirm);

				this.arrayOfItems[menu.selectedItem].func(); // It's important to happen last because if it opens a sub-menu, we dont want that menu to be intereferd with by code after.
			};	
		};


		document.addEventListener('keydown',down);
		document.addEventListener('keydown',up);
		document.addEventListener('keydown',confirm);
	}

	display() {

		// Go through each menu item and find which one is the longest
		let maxLength = 0;
		this.arrayOfItems.forEach((item)=>{
			(maxLength < item.content.length) ? maxLength = item.content.length : (()=>{})();
		});

		ctx.font = menu.fontSize + "px MonospaceParker"; // My own font :D
		menu.active = true;
		ctx.fillStyle = menu.backgroundColor;
		ctx.strokeStyle = menu.borderColor;

		// Draw rectangle
		((x,y,w,h)=>{
			ctx.strokeRect(x,y,w,h);
			ctx.fillRect(x,y,w,h);
		})(this.position.x,this.position.y,maxLength * menu.fontSize / 1.4 + 16,menu.fontSize * this.arrayOfItems.length + 5)

		// Write each menu item
		ctx.fillStyle = menu.borderColor;
		this.arrayOfItems.forEach((item,i)=>{
			ctx.fillText(((i)=>{if (i == menu.selectedItem) {return '>'} else {return ''}})(i) + item.content,this.position.x + 5,this.position.y + (menu.fontSize + menu.fontSize * i));
		});
	}
}

class MenuItem {
	constructor(content, func) {
		this.content = content;
		this.func = func;
	}
}