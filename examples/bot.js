var five = require('johnny-five');
var redbot = require('../lib/redbot');

board = new five.Board();

board.on("ready", function() {
	var motor = new redbot.RedbotMotor(board);
	var encoder = new redbot.RedbotEncoder(board, 15, 16, motor.leftMotor, motor.rightMotor);

	var turnWheelOnce = function(){
		encoder.clearEnc("BOTH");
		var stopListener = function(ticks){
			if(ticks > 16 || ticks < -16){
				motor.brake();
				console.log(encoder.getTicks("LEFT"));
			}
		}

		encoder.leftEncoder.on('tick', stopListener);
		motor.drive(180);
	}

	this.repl.inject( {e: encoder, m:motor, t: turnWheelOnce});

	


});