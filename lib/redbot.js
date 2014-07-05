[
  "RedbotMotor",
  "RedbotEncoder"
].forEach(function(constructor) {
  module.exports[constructor] = require(
    "../lib/" + constructor.toLowerCase()
  );
});

