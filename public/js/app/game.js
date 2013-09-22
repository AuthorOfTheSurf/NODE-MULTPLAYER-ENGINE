/**************************************************
** GAME VARIABLES
**************************************************/
var localPlayer,	// Local player
	remotePlayers,	// Remote players
	playerTimes,
	playersNum,
	playaNum,
	playerID,
	setPlaya,
	playersReady,
	thisReady,
	totalSeconds,
	socket;			// Socket connection


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {


	// Setup array to store game times ///
	//var gameTime = 0; //set game Timer
	playerTimes = [0,0,0,0];
	playersReady = []
	thisReady = false;
	setPlaya = false;

	// Initialise the local player
	localPlayer = new Player(playerTimes, thisReady);

	// Initialise socket connection
	socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});

	// Initialise remote players array
	remotePlayers = [];

	// set value for the number of players
	playersNum = remotePlayers.length + 1
	localPlayer.setPos(playersNum)
	console.log ("player Pos is " + localPlayer.getPos())
	// Start listening for events
	setEventHandlers();


};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {

	// Socket connection successful
	socket.on("connect", onSocketConnected );
	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);
	// Listen for this player
	socket.on("this player", thisPlayer);
	// New player message received
	socket.on("new player", onNewPlayer);
	// Player removed message received
	socket.on("remove player", onRemovePlayer);
	// Players ready message received
	socket.on("players ready", onPlayersReady);
	// Players ready message received
	socket.on("all ready", allReady);
	// Players ready message received
	socket.on("game over", endGame);
	// All finished message
	socket.on("all over", allOver);
	// Restart game message
	socket.on("restart", restart);
};


// Socket connected
function onSocketConnected() {

	console.log("Connected to socket server " + localPlayer.getId() );
	$("#playersNum").html( localPlayer.getId() ); // ALL PLAYERS IN LIST
	$("#playerNum").html( localPlayer.getId() );	// INDIVIDUAL PLAYER

	// Send local player data to the game server
	socket.emit("new player", {id: localPlayer.getId() });


};

// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

// New player
function onNewPlayer(data) {
	console.log("New player connected: "+data.id);

	//UPDATE the player list
	$("#playerlist").append("<li>new player joined party <span style=color:black>" + data.id + "</span></li>");

	// Initialise the new player
	var newPlayer = new Player(data.id);
	newPlayer.id = data.id;

	// Add new player to the remote players array
	remotePlayers.push(newPlayer);

	//Set the position of player
	playaNum = remotePlayers.indexOf(localPlayer.getId())

	// set value for the number of players
	playersNum = remotePlayers.length + 1
	$("#playersNum").html( playersNum ); // UPDATE the player list ALL PLAYERS IN LIST

	
	//console.log("play num = " +playaNum + " " + localPlayer.getId())
 };


function updateList(){

}

// Remove player
function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);

	// Player not found
	if (!removePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Remove player from array
	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/

function thisPlayer(data){
	if(setPlaya == false){
		playerID = data.id;
		localPlayer.setId(playerID)

		console.log("This player is: " + playerID);

		playaNum = data.length
		localPlayer.setPos(playaNum) 
		$("#playerNum").html( "id: <span style=color:black>" + playerID + "</span> number is <span style=color:black>" + playaNum );
		setPlaya = true;

		// Display if ready to play
		$("#playerReady").html( thisReady );
	}
	
	//localPlayer.setPos()
	
	console.log("localplayer id " + localPlayer.getId() )
	console.log("localplayer pos " + localPlayer.getPos() )
	console.log("players length " + ( data.length ) )

	/**************************************************==========================
	 ///////THE 5th PLAYER IS THE HOST! CHECK IF ITS HIM AND SHOW THE LEADERBOARD
	 ***************************************************************************/
	
	if(localPlayer.getPos() >= 5){
			var playerImg = document.getElementById("players");
			var clock = document.getElementById("clock");
			playerImg.style.display = "none"
			clock.style.display = "none";
	}


}

function onPlayersReady(data){
	console.log("players ready " + data.ready)
}


function playerStart(){

	localPlayer.playerReady = true;
	console.log("this player is ready!" + localPlayer.playerReady);
	$("#playerReady").html( localPlayer.playerReady );


	// Send ready state to the game server
	socket.emit("players ready", {ready: localPlayer.playerReady });

	playersReady.push(localPlayer.playerReady);
	console.log(playersReady)

}

function allReady(){
	console.log("START THE GAME")
	$('body').css({"backgroundColor":"green"});

	//start the clock
	clock()
}

function playerEnd(){

	localPlayer.playerReady = false;
	console.log("this player is ready! " + localPlayer.playerReady);
	$("#playerReady").html( localPlayer.playerReady );

	$('body').css({"backgroundColor":"grey"});

	//stop the clock 
	clearInterval(timerCount);

	localPlayer.setTime(totalSeconds);

	console.log("players time is : " + localPlayer.getTime() )

	//Send the game server the game time
	socket.emit("game over", {id:localPlayer.getId(), pos:localPlayer.getPos(), gameTime: localPlayer.getTime() });

}

function endGame(data){

	var winner = data.winner

	if(winner == true){
		console.log("YOU WON YOUR GREAT FLIPPER")
			//UPDATE the leaders list
			$("#leaderlist").append("<li>user <span style=color:black>" + data.id + "</span> time:  <span style=color:black>" + data.time + "<span style=color:white>WINNER!!!</span></li>");

	}
	else{
			//UPDATE the leaders list
			$("#leaderlist").append("<li>user <span style=color:black>" + data.id + "</span> time:  <span style=color:black>" + data.time + "</li>");
		}


}

// END OF THE GAME AND REPLAY FUNCTIONS ///=========================================================================
function allOver(){
	var replay = document.getElementById("replay");
	replay.style.display = "inline"
}

function replayGame(){
	// RESETS ALL GAME VARIABLES AND USERS PLAY AGAIN
	
	 socket.emit("restart" );
}

function restart(){
	// RESETS ALL GAME VARIABLES AND USERS PLAY AGAIN
	 $("#leaderlist").empty(); 
	 totalSeconds = 0;
	 localPlayer.setTime(totalSeconds);
	 var replay = document.getElementById("replay");
	 replay.style.display = "none"

	 $('body').css({"backgroundColor":"white"});
}


// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].id == id)
			return remotePlayers[i];
	};
	
	return false;
};