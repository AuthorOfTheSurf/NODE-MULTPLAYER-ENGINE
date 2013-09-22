/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require("util"),					// Utility resources (logging, object inspection, etc)
	io = require("socket.io"),				// Socket.IO
	Player = require("./Player").Player;	// Player class


/**************************************************
** GAME VARIABLES
**************************************************/
var socket,			// Socket controller
	players,		// Array of connected players
	allReady, 		// Count the users who ready to play
	endCount, 		// Counts the users who finished
	playerTimes;	// Array of connected players Game times


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	
	// Create an empty array to store players
	players = [];

	// Create an empty array to store players game Times
	playerTimes = [];

	allReady = [];
	endCount = 0;

		// Set up Socket.IO to listen on port 8000
		socket = io.listen(8000);

		// Configure Socket.IO
		socket.configure(function() {
		// Only use WebSockets
		socket.set("transports", ["websocket"]);
		// Restrict log output
		socket.set("log level", 2);
	});

	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Socket.IO
	socket.sockets.on("connection", onSocketConnection);
};

// New socket connection
function onSocketConnection(client) {
	util.log("New player has connected: "+client.id);
	util.log("players in game: " + (players.length +1) );

	//Send the Client ID to player
	this.emit("this player", {id: client.id, length: (players.length +1) });

	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);

	// Listen for new player message
	client.on("new player", onNewPlayer);

	// Listen for the player ready
	client.on("players ready", onPlayersReady )

	//Listen for the game Ended
	client.on("game over", gameEnd )

	//
	client.on("restart", restartGame )
	
};

// Socket client has connected
function thisPlayer(data) {
	util.log("THIS Player has conected: "+this.id);

};

function  onPlayersReady(data) {
	util.log("player ready: " + data.ready);

	// Add player to the ready array
	allReady.push(data.ready);
	util.log("all players ready: " + allReady);

	if(allReady.length >= 4){
		// Broadcast all ready to play the game player 
		util.log("play the game");
		this.broadcast.emit("all ready");
		this.emit("all ready");
	}
}

function gameEnd(data){
	util.log("end game for " + data.id + " user "  + data.pos + " time is " + data.gameTime );

	// Increase end count and check if all have finished
	++endCount;

	switch (endCount)
	{
		case 1:
	 		//  PLAYER WINS
	 		util.log("WINNER!" );
			this.emit("game over", {id: data.pos, winner:true, time: data.gameTime});
			this.broadcast.emit("game over", {id: data.pos, time: data.gameTime});
	 	 break;

		case 4:
	 	  util.log("ALL PLAYERS HAVE FINSHED!" );
	 	  //  PLAYER WINS
	 	  this.emit("game over", {id: data.pos, winner:false, time: data.gameTime});
	 	  this.broadcast.emit("game over", {id: data.pos, winner:false, time: data.gameTime});
		  
		  this.emit("all over");
		  this.broadcast.emit("all over");
	 	break;

		default:
  			// None winner end game
	 		//  PLAYER WINS
	 		util.log("DONE!" );
	 		this.emit("game over", {id: data.pos, winner:false, time: data.gameTime});
			this.broadcast.emit("game over", {id: data.pos, winner:false, time: data.gameTime});
	 	break;
	}

}

function restartGame(){
	util.log("restart the gane... " );
	allReady.length = 0;
	endCount = 0;

	//SEND OUT MESSAGE TO ALL USERS TO RESTART THE APP
	this.emit("restart" );
	this.broadcast.emit("restart" );
}

// Socket client has connected
function onClientConnect() {
	util.log("THIS Player has conected: "+this.id);
};


// Socket client has disconnected
function onClientDisconnect() {
	util.log("Player has disconnected: "+this.id);

	var removePlayer = playerById(this.id);

	// Player not found
	if (!removePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});
};

// New player has joined
function onNewPlayer(data) {
	// Create a new player
	var newPlayer = new Player(0, false);
	newPlayer.id = this.id;

	// Broadcast new player to connected socket clients
	this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getId() });

	// Send existing players to the new player
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getId() });
	};
		
	// Add new player to the players array
	players.push(newPlayer);
};




/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < players.length; i++) {
		if (players[i].id == id)
			return players[i];
	};
	
	return false;
};


/**************************************************
** RUN THE GAME
**************************************************/
init();