class Spell {
	constructor(name,desc,func,damage) {
		this.name   = name;
		this.desc   = desc;
		this.damage = damage;
		this.cast   = func;
	}
}

class Character {
	constructor(name,fileName,proficiency,goodGuy,spells,damage,speed) {
		this.name 		 = name;
		this.fileName    = fileName;
		this.proficiency = proficiency;
		this.goodGuy     = goodGuy;
		this.spells      = spells;
		this.damage      = damage;
		this.speed       = speed;
	}
};

class GoodGuy extends Character {
	constructor(name,fileName,proficiency,spells,speed) {
		super(name,fileName,proficiency,true,spells,1,speed);

		this.activeWeapon = '';
	}
};

class BadGuy extends Character {
	constructor(name,fileName,proficiency,spells,damage,speed) {
		super(name,fileName,proficiency,false,spells,damage,speed);
	}
};

var battle = {
	active:false,
	characters:{
		'mark': new GoodGuy('Mark','mark','melee',[],6),
		'owen': new GoodGuy('Owen','owen','',[
			new Spell('Computer Virus','Infect all enemies with the "Computer Virus" debuff, decreasing attack power for a few turns',(enemy,damage)=>{
				activeCharacters.forEach((individual)=>{
					if (!individual.goodGuy) {
						individual.buffs.push('computerVirus');
					};
				});
			},0),
			new Spell('Debug','Cure a friend of most ailments. Effective 75% of the time',()=>{},0)
		],8),

		'ciaAgent': new BadGuy('CIA Agent','ciaAgent','melee',[],8,4)
	}
};

battle.characters.mark.activeWeapon = 0;



class Battle {
	constructor(memberList,location) {
		this.memberList = memberList;
		this.location   = location;
 	}

 	updateCurrentMember() {
 		this.currentMember = this.memberList[this.currentMemberIndex];
 	}

 	takeTurn(actionString) {

 		this.currentMemberIndex = (this.currentMemberIndex + 1) % this.members.length;
 	}

 	initiate() {
 		battle.active = true;

 		this.currentMemberIndex = 0;

 		// Order by speed
 		this.memberList.sort((a,b)=>{return b.speed - a.speed});
 	}

 	render() {
 		// Draw background
 		ctx.drawImage(graphics.images['battle/backgrounds/' + this.location + '.png'],0,0);

 		// Get good guys
 		let goodGuys = [];
 		this.memberList.forEach((member)=>{
 			if (member.goodGuy) {
 				goodGuys.push(member);
 			};
 		});
 		// Get bad guys
 		let badGuys = [];
 		this.memberList.forEach((member)=>{
 			if (!member.goodGuy) {
 				badGuys.push(member);
 			};
 		});

 		// Now draw each
 		goodGuys.forEach((member,index)=>{
 			ctx.drawImage(graphics.images['battle/' + member.fileName + '/idle.png'],30,c.height / 4 + (index * 80),48*2,48*2);
 		});
 		badGuys.forEach((member,index)=>{
 			ctx.drawImage(graphics.images['battle/' + member.fileName + '/idle.png'],c.width - 60 - 48,c.height / 4 + (index * 80),48*2,48*2);
 		});
 		
 	}
};