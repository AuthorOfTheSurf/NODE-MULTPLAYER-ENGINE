/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(gameTime, playerReady) {
	var gameTime, // timer for fliper
		playerReady,
		position,
		id;


	// GET / SET TIMER.
	var getTime = function(){
		return gameTime
	}

	var setTime = function(newTime){
		gameTime = newTime
	}

	// GET THE ID
	var getId = function(){
		return id
	}

	setId = function(newId){
		id = newId;
	}

	// GET SET GAME READY STATE
	var getReady = function(){
		return playerReady
	}

	var setReady = function(newReady){
		playerReady = newReady
	}

	// GET SET POSITION IN ARRAY
	var getPos = function(){
		return position
	}

	var setPos = function(newPos){
		position = newPos
	}



	// Define which variables and methods can be accessed
	return {
		
		getId : getId,
		setId : setId,
		getTime: getTime,
		setTime: setTime,
		getReady: getReady,
		setReady: setReady,
		gameTime: gameTime,
		getPos: getPos,
		setPos: setPos,

		id: id
	}
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;