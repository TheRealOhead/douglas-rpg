  ///////////////////////
 // CANVAS DELARATION //
///////////////////////

let c = document.getElementsByTagName('canvas')[0];
let ctx = c.getContext('2d');


  //////////////////////
 // USEFUL FUNCTIONS //
//////////////////////

function collision(obj1, obj2) {
	return obj1.position.x < obj2.position.x + obj2.collisionBox.width && obj1.position.x + obj1.collisionBox.width > obj2.position.x && obj1.position.y < obj2.position.y + obj2.collisionBox.height && obj1.collisionBox.height + obj1.position.y > obj2.position.y;
};