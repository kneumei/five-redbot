var five = require('johnny-five');
var events = require("events");
var util = require("util");

function SingleRedbotEncoder(board, pin, motor){
	var encoder = board.pinMode(pin, five.Pin.INPUT)
	var ticks = 0;

	var handler = function(val){
		if(val!=1) return;
		if(motor.direction == 'FWD'){
			ticks++;
		}else if(motor.direction = 'REV'){
			ticks --;
		}
		this.emit("tick", ticks)
	}.bind(this);

	this.clearEnc = function(){
		ticks = 0;
	}

	this.getTicks = function(){
		return ticks;
	}
	board.digitalRead(pin, handler);
};

util.inherits(SingleRedbotEncoder, events.EventEmitter);

function RedbotEncoder(board, leftPin, rightPin, leftMotor, rightMotor){
	var leftEncoder = new SingleRedbotEncoder(board, leftPin, leftMotor);
	var rightEncoder = new SingleRedbotEncoder(board, rightPin, rightMotor);

	this.clearEnc = function(wheel){
		if(wheel=="LEFT"){
			leftEncoder.clearEnc();
		}
		else if(wheel=="RIGHT"){
			rightEncoder.clearEnc();
		}
		else if(wheel=="BOTH"){
			leftEncoder.clearEnc();
			rightEncoder.clearEnc();
		}
	}

	this.getTicks = function(wheel){
		if(wheel=="LEFT"){
			return leftEncoder.getTicks();
		}else if (wheel=="RIGHT"){
			return rightEncoder.getTicks();
		}
	}
	this.leftEncoder = leftEncoder;
	this.rightEncoder = rightEncoder;
}

module.exports = RedbotEncoder