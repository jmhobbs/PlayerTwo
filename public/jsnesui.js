var DRampageUI = function (nes) {
	var self = this;
	this.nes = nes;
	this.screen = document.getElementById("screen");
	this.status = document.getElementById("status");
	this.canvasContext = this.screen.getContext('2d');
	this.canvasImageData = this.canvasContext.getImageData(0, 0, 256, 240);
	this.dynamicaudio = new DynamicAudio({
		swf: this.nes.opts.swfPath + 'dynamicaudio.swf'
	});

	this.resetCanvas = function() {
		self.canvasContext.fillStyle = 'black';
		// set alpha to opaque
		self.canvasContext.fillRect(0, 0, 256, 240);
		// Set alpha
		for (var i = 3; i < self.canvasImageData.data.length-3; i += 4) {
			self.canvasImageData.data[i] = 0xFF;
		}
	};

	this.resetCanvas();

	// Player One Key-Map

	function setKey (key, value) {
		switch (key) {
			case 88: self.nes.keyboard.state1[self.nes.keyboard.keys.KEY_A] = value; break;      // X
			case 89: self.nes.keyboard.state1[self.nes.keyboard.keys.KEY_B] = value; break;      // Y (Central European keyboard)
			case 90: self.nes.keyboard.state1[self.nes.keyboard.keys.KEY_B] = value; break;      // Z
			case 17: self.nes.keyboard.state1[self.nes.keyboard.keys.KEY_SELECT] = value; break; // Right Ctrl
			case 13: self.nes.keyboard.state1[self.nes.keyboard.keys.KEY_START] = value; break;  // Enter
			case 38: self.nes.keyboard.state1[self.nes.keyboard.keys.KEY_UP] = value; break;     // Up
			case 40: self.nes.keyboard.state1[self.nes.keyboard.keys.KEY_DOWN] = value; break;   // Down
			case 37: self.nes.keyboard.state1[self.nes.keyboard.keys.KEY_LEFT] = value; break;   // Left
			case 39: self.nes.keyboard.state1[self.nes.keyboard.keys.KEY_RIGHT] = value; break;  // Right
			default: return true;
		}
		return false;
	}

	$(document)
		.bind('keydown', function(evt) {
			if(! setKey(evt.keyCode, 0x41) ) {
				evt.preventDefault();
			}
		})
		.bind('keyup', function(evt) {
			if(! setKey(evt.keyCode, 0x40) ) {
				evt.preventDefault();
			}
		})
		.bind('keypress', function(evt) {
			evt.preventDefault();
		});


	// JSNES interface

	this.enable = function() { self.resetCanvas(); };

	this.updateStatus = function(status) {
		self.status.innerText = status;
	};

	this.writeAudio = function(samples) {
		return self.dynamicaudio.writeInt(samples);
	};

	this.writeFrame = function(buffer, prevBuffer) {
		var imageData = self.canvasImageData.data;
		var pixel, i, j;

		for (i=0; i<256*240; i++) {
			pixel = buffer[i];

			if (pixel != prevBuffer[i]) {
				j = i*4;
				imageData[j] = pixel & 0xFF;
				imageData[j+1] = (pixel >> 8) & 0xFF;
				imageData[j+2] = (pixel >> 16) & 0xFF;
				prevBuffer[i] = pixel;
			}
		}

		self.canvasContext.putImageData(self.canvasImageData, 0, 0);
	};

};
