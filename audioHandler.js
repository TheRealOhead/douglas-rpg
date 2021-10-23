let soundList = ['textBeep.wav','menuMove.wav'];

var audio = {
	sounds:{

	}
};

soundList.forEach((sound)=>{
	audio.sounds[sound] = new Audio();
	audio.sounds[sound].src = 'sounds/' + sound;
});