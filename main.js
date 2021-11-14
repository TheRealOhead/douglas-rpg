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

/*
function swap(array, indexA, indexB) {
  let temp = array[indexB];
  array[indexB] = array[indexA];
  array[indexA] = temp;

  return array;
};

function battleIsSorted(array) {
  let done = true;
  for (let i = 1; i < array.length; i++) {
    if (array[i - 1].speed > array[i].speed) {
      done = false;
    };
  };
  return done;
};

function battleSort(array) {

  while (!battleIsSorted(array)) {    
    // Find largest one
    let largest = -1;
    array.forEach((item,index)=>{
      if (array[index].speed >= largest) {
        largest = array[index].speed;
      }
    });

    array = swap(array,array.length - 1,largest);
  };

  return array;
};*/