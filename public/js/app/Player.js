/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(gameTime, playerReady) {
	var gameTime, // timer for fliper
		playerReady, // Value to store if ready to play
		id,
		position,
		moveAmount = 2;

	
	// Getters and setters //====================================
	
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



	setId = function(newId){
		id = newId;
	}


	// Define which variables and methods can be accessed
	return {

		getId : getId,
		setId : setId,
		getReady: getReady,
		setReady: setReady,
		getTime: getTime,
		setTime: setTime,
		getPos: getPos,
		setPos: setPos,
		gameTime: gameTime
	}
};