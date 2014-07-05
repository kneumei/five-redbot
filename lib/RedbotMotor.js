var five = require("johnny-five");
var redbotPins = require("./redbot.pins")


function SingleRedbotMotor(board, opts) {

  var pins = opts.pins;
  var board = board;
  var direction = "";

  board.pinMode(pins.pwm, five.Pin.PWM);
  board.pinMode(pins.ctrl_1, five.Pin.OUTPUT);
  board.pinMode(pins.ctrl_2, five.Pin.OUTPUT);

  this.driveFwd = function(speed){
    board.digitalWrite(pins.ctrl_1, 1);
    board.digitalWrite(pins.ctrl_2, 0);
    board.analogWrite(pins.pwm, speed);
    direction = "FWD";
  }

  this.driveRev = function(speed){
    board.digitalWrite(pins.ctrl_1, 0);
    board.digitalWrite(pins.ctrl_2, 1);
    board.analogWrite(pins.pwm, speed);
    direction = "REV";
  }

  this.stop = function(){
    board.digitalWrite(pins.ctrl_1, 0);
    board.digitalWrite(pins.ctrl_2, 0);
    board.analogWrite(pins.pwm, 0);
  }

  this.brake = function(){
    board.digitalWrite(pins.ctrl_1, 1);
    board.digitalWrite(pins.ctrl_2, 1);
    board.analogWrite(pins.pwm, 0);
  }

  this.getDirection = function(){
    return direction;
  }
}

function RedbotMotor(board)
{
  var leftMotor = new SingleRedbotMotor(
    board, {
      pins:{
        pwm: redbotPins.PWM_L, 
        ctrl_1: redbotPins.L_CTRL_1, 
        ctrl_2: redbotPins.L_CTRL_2
      }
    });

  var rightMotor = new SingleRedbotMotor(
    board, {
      pins:{
        pwm: redbotPins.PWM_R, 
        ctrl_1: redbotPins.R_CTRL_1, 
        ctrl_2: redbotPins.R_CTRL_2
      }
    });

  this.drive = function(speed){
    if(speed > 0){
      leftMotor.driveFwd(speed);
      rightMotor.driveFwd(speed);  
    }else{
      leftMotor.driveRev(Math.abs(speed))
      rightMotor.driveRev(Math.abs(speed))
    }
  }

  this.stop = function(){
    leftMotor.stop();
    rightMotor.stop();
  }

  this.brake = function(){
    leftMotor.brake();
    rightMotor.brake();
  }

  this.pivot = function(speed){
    if(speed >0){
      leftMotor.driveRev(Math.abs(speed));
      rightMotor.driveFwd(Math.abs(speed));
    }else{
      leftMotor.driveFwd(Math.abs(speed));
      rightMotor.driveRev(Math.abs(speed));
    }
  }

  this.leftMotor = leftMotor;
  this.rightMotor = rightMotor;
}

module.exports = RedbotMotor;
