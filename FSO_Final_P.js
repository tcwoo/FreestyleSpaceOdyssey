/**
 * Initialize the Game and start it.
 */
var game = new Game();
var RUN = true;
var score = 0;
var level = 1;
var what = 300;
var whatthe = 2;
var levelmult = 1.025;
var scoreadd = 0;
var scoremult = 2;
var points = 5;
function init() {
	if(game.init()) {
			game.start();
	}
}

/**
 * Define an object to hold all our images for the game so images
 * are only ever created once. This type of object is known as a 
 * singleton.
 */
function getQueryVariable(variable)	{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
var imageRepository = new function() {
	/// Define images
	this.background = new Image();
	this.spaceship = new Image();
	this.bullet = new Image();
	this.meteor = new Image();
	this.asteroid = new Image();
	this.enemy = new Image();
	// Ensure all images have loaded before starting the game
	var numImages = 5;
	var numLoaded = 0;
	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			window.init();
		}
	}
	this.background.onload = function() {
		imageLoaded();
	}
	this.spaceship.onload = function() {
		imageLoaded();
	}
	this.bullet.onload = function() {
		imageLoaded();
	}
	this.asteroid.onload = function() {
		imageLoaded();
	}
	this.enemy.onload = function() {
		imageLoaded();
	}
	// Set images src
	this.background.src = "images/Star2.png";
	var shipname = getQueryVariable("ship");
		if (shipname == "RedRover") {
			this.spaceship.src = "images/ship11.png";
		} else if (shipname == "YellowFever") {
			this.spaceship.src = "images/ship22.png";
		} else if (shipname == "GreenSwarm") {
			this.spaceship.src = "images/ship33.png";
		}
	this.bullet.src = "images/bullet.png";
	this.asteroid.src = "images/asteroid.png";
	this.enemy.src = "images/enemyship.png";
}

/**
 * Creates the Drawable object which will be the base class for
 * all drawable objects in the game. Sets up default variables
 * that all child objects will inherit, as well as the defualt
 * functions. 
 */
function Drawable() {
	this.init = function(x, y, width, height) {
		// Default variables
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	};
	
	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	
	// Define abstract function to be implemented in child objects
	this.draw = function() {
	};
	this.move = function() {
	};
}

/**
 * Creates the Background object which will become a child of
 * the Drawable object. The background is drawn on the "background"
 * canvas and creates the illusion of moving by panning the image.
 */
function Background() {
	this.speed = 1; // Redefine speed of the background for panning
	
	// Implement abstract function
	this.draw = function() {
		// Pan background
		this.y += this.speed;
		this.context.drawImage(imageRepository.background, this.x, this.y);
		
		// Draw another image at the top edge of the first image
		this.context.drawImage(imageRepository.background, this.x, this.y - this.canvasHeight);

		// If the image scrolled off the screen, reset
		if (this.y >= this.canvasHeight)
			this.y = 0;
	};
}
// Set Background to inherit properties from Drawable
Background.prototype = new Drawable();

var ex = 0;
var espeed = 3;
var rndcount = 0;
function drawEnemy() {
	//this.speed = 3;
	//this.x = ex;
	this.y = 0;
	var canvas = document.getElementById("main");
  	var context = canvas.getContext("2d");
	this.draw = function() {
		context.clearRect(ex, this.y, 469, 348);
		if (level == 3) {
			if(rndcount == 0) {
				context.clearRect(ex, this.y, 469, 348);
				ex = -100;
				espeed = 4;
				rndcount++;
			}
		}
		if (level == 5) {rndcount =0;}
		if (level == 6) {
			if(rndcount == 0) {
				context.clearRect(ex, this.y, 469, 348);
				ex = -100;
				espeed = 5;
				rndcount++;
			}
		}
		if (level == 8) {rndcount =0;}
		if (level == 9) {
			if(rndcount == 0) {
				context.clearRect(ex, this.y, 469, 348);
				ex = -100;
				espeed = 6;
				rndcount++;
			}
		}
		ex += espeed;
		context.drawImage(imageRepository.enemy, ex, this.y);
		
		if (ex >= 740) {
			espeed = -espeed;
		}
		if (ex <= -250) {
			espeed = -espeed;
		}
	}
}
drawEnemy.prototype = new Drawable();

function drawScore() {
	var canvas = document.getElementById("main");
  	var context = canvas.getContext("2d");
    context.font = "lighter italics 20px Courier New";
    context.fillStyle = "white";
    this.draw = function() {
		if (this.score != 0) {
			//context.clearRect(800, 0, 160, 30);
    		//context.fillText("Score: " + score, 800, 20, 150);
    		context.clearRect(800, 0, 160, 30);
    		context.fillText("Level: " + level + " Score: " + score, 700, 20, 250);
		}
		else {
			//context.fillText("Score: " + score, 800, 20, 150);
			context.fillText("Level: " + level + "Score: " + score, 700, 20, 250);
		}
	};
}
drawScore.prototype = new Drawable();

function drawUsername() {
	var username = getQueryVariable("username")
  	var canvas = document.getElementById("main");
  	var context = canvas.getContext("2d");
  	context.fillStyle = "white";
  	context.font = "lighter italic 20px Courier New";
  	this.draw = function() {
  		if (true) {
  			context.clearRect(10, 0, 1000, 30);
			context.fillText("Username: " + username, 10, 20);
		}
		else {
			context.fillText("Username: " + username, 10, 20);
		}
	};
}
drawUsername.prototype = new Drawable();


/**
 * Creates the Bullet object which the ship fires. The bullets are
 * drawn on the "main" canvas.
 */
function Bullet(object) {	
	this.alive = false; // Is true if the bullet is currently in use
	var self = object;
	/*
	 * Sets the bullet values
	 */
	this.spawn = function(x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.alive = true;
	};

	/*
	 * Uses a "dirty rectangle" to erase the bullet and moves it.
	 * Returns true if the bullet moved off the screen, indicating that
	 * the bullet is ready to be cleared by the pool, otherwise draws
	 * the bullet.
	 */
	 
	this.draw = function() {
		this.context.clearRect(this.x-1, this.y-1, this.width+1, this.height+1);
		this.y -= this.speed;

		if (self === "bullet" && this.y <= 0 - this.height+175 && this.x <= 469+ex && this.x >= ex) {
			score += points+scoreadd;
			if(score >= what) {
				what += what*levelmult;
				level++;
				if (level >= whatthe) {
					whatthe += 2;
					scoreadd += points*scoremult;
				}
			} return true;
		}
		if (self === "bullet" && this.y <= 0 - this.height+330 && this.x <= 130+ex && this.x >= 30+ex) {
			score += points+scoreadd;
			if(score >= what) {
				what += what*levelmult;
				level++;
				if (level >= whatthe) {
					whatthe += 2;
					scoreadd += points*scoremult;
				}
			} return true;
		}
		if (self === "bullet" && this.y <= 0 - this.height+330 && this.x <= 440+ex && this.x >= 340+ex) {
			score += points+scoreadd;
			if(score >= what) {
				what += what*levelmult;
				level++;
				if (level >= whatthe) {
					whatthe += 2;
					scoreadd += points*scoremult;
				}
			} return true;
		}
		if (self === "bullet" && this.y <= 0 - this.height) {
			return true;
		}
		else if (self === "asteroid" && this.y >= this.canvasHeight) {
			return true;
		}
		else {
			if (self === "bullet") {
				this.context.drawImage(imageRepository.bullet, this.x, this.y);
			}
			else if (self === "asteroid") {
				this.context.drawImage(imageRepository.asteroid, this.x, this.y);
			}
			return false;
		}
	};
	/*
	 * Resets the bullet values
	 */
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.alive = false;
	};
}
Bullet.prototype = new Drawable();

/**
 * Custom Pool object. Holds Bullet objects to be managed to prevent
 * garbage collection. 
 * The pool works as follows:
 * - When the pool is initialized, it popoulates an array with 
 *   Bullet objects.
 * - When the pool needs to create a new object for use, it looks at
 *   the last item in the array and checks to see if it is currently
 *   in use or not. If it is in use, the pool is full. If it is 
 *   not in use, the pool "spawns" the last item in the array and 
 *   then pops it from the end and pushed it back onto the front of
 *   the array. This makes the pool have free objects on the back 
 *   and used objects in the front.
 * - When the pool animates its objects, it checks to see if the 
 *   object is in use (no need to draw unused objects) and if it is, 
 *   draws it. If the draw() function returns true, the object is 
 *   ready to be cleaned so it "clears" the object and uses the 
 *   array function splice() to remove the item from the array and 
 *   pushes it to the back.
 * Doing this makes creating/destroying objects in the pool 
 * constant.
 */
function Pool(maxSize) {
	var size = maxSize; // Max bullets allowed in the pool
	var pool = [];
	/*var bulletpool = [];
	var meteorpool = [];
	var asteroidpool = [];*/
	//Populates the pool array with the given object
	this.init = function(object) {
		if (object == "bullet") {
			for (var i = 0; i < size; i++) {
				// Initalize the object
				var bullet = new Bullet("bullet");
				bullet.init(0,0, imageRepository.bullet.width, imageRepository.bullet.height);
				//bulletpool[i] = bullet;
				pool[i] = bullet;
			}
		}
		else if (object == "meteor") {
			for (var i = 0; i < size; i++) {
				var meteor = new Meteor();
				meteor.init(0,0, imageRepository.meteor.width, imageRepository.meteor.height);
				//meteorpool[i] = meteor;
				pool[i] = meteor;
			}
		}
		else if (object == "asteroid") {
			for (var i = 0; i < size; i++) {
				var bullet = new Bullet("asteroid");
				bullet.init(0,0, imageRepository.asteroid.width, imageRepository.asteroid.height);
				//asteroidpool[i] = bullet;
				pool[i] = bullet;
			}
		}
	};
	/*
	 * Grabs the last item in the list and initializes it and
	 * pushes it to the front of the array.
	 */
	this.get = function(x, y, speed/*, pooltype*/) {
		if(!pool[size - 1].alive) {
				pool[size - 1].spawn(x, y, speed);
				pool.unshift(pool.pop());
		}
		/*if(pooltype == "bullet") {
			if(!bulletpool[size - 1].alive) {
				bulletpool[size - 1].spawn(x, y, speed);
				bulletpool.unshift(bulletpool.pop());
			}
		} else if(pooltype == "meteor") {
			if(!meteorpool[size - 1].alive) {
				meteorpool[size - 1].spawn(x, y, speed);
				meteorpool.unshift(meteorpool.pop());
			}
		}else if(pooltype == "asteroid") {
			if(!asteroidpool[size - 1].alive) {
				asteroidpool[size - 1].spawn(x, y, speed);
				asteroidpool.unshift(asteroidpool.pop());
			}
		}*/
	};
	/*
	 * Used for the ship to be able to get two bullets at once. If
	 * only the get() function is used twice, the ship is able to
	 * fire and only have 1 bullet spawn instead of 2.
	 */
	this.getTwo = function(x1, y1, speed1, x2, y2, speed2) {
		if(!pool[size - 1].alive && !pool[size - 2].alive) {
			this.get(x1, y1, speed1);
			this.get(x2, y2, speed2);
		}
		/*if(!bulletpool[size - 1].alive && !bulletpool[size - 2].alive) {
			this.get(x1, y1, speed1);
			this.get(x2, y2, speed2);
		}*/
	};
	/*
	 * Draws any in use Bullets. If a bullet goes off the screen,
	 * clears it and pushes it to the front of the array.
	 */
	this.animate = function() {
		for (var i = 0; i < pool.length; i++) {
			// Only draw until we find a bullet that is not alive
			if (pool[i].alive) {
				if (pool[i].draw()) {
					pool[i].clear();
					pool.push((pool.splice(i,1))[0]);
				}
			}
			else
				break;
		}
		/*for (var i = 0; i < bulletpool.length; i++) {
			// Only draw until we find a bullet that is not alive
			if (bulletpool[i].alive) {
				if (bulletpool[i].draw()) {
					bulletpool[i].clear();
					bulletpool.push((bulletpool.splice(i,1))[0]);
				}
			}
			else
				break;
		} for (var i = 0; i < meteorpool.length; i++) {
			if (meteorpool[i].alive) {
				if (meteorpool[i].draw()) {
					meteorpool[i].clear();
					meteorpool.push((meteorpool.splice(i,1))[0]);
				}
			}
			else
				break;
		} for (var i = 0; i < asteroidpool.length; i++) {
			if (asteroidpool[i].alive) {
				if (asteroidpool[i].draw()) {
					asteroidpool[i].clear();
					asteroidpool.push((asteroidpool.splice(i,1))[0]);
				}
			}
			else
				break;
		}*/
	};
}
/*function Collision() {
	for(var i = 0; i < Pool.meteorpool; i++) {
        var meteor = Pool.meteorpool[i];
        var asteroid = Pool.asteroidpool[i];
        if((Meteor.x + imageRepository.meteor.width/2) > (Ship.x - imageRepository.spaceship.width/2) && 
           	(Meteor.x - imageRepository.meteor.width/2) < (Ship.x + imageRepository.spaceship.width/2) &&
            (Meteor.y + imageRepository.meteor.height/2) > (Ship.y - imageRepository.spaceship.height/2) &&
           	(Meteor.y - imageRepository.meteor.height/2) < (Ship.y + imageRepository.spaceship.height/2)){
           	if (meteor.draw()) {
           		meteor.clear();
				meteor.push((meteor.splice(i,1))[0]);
			}
			if (asteroid.draw()) {
        		asteroid.clear();
				asteroid.push((asteroid.splice(i,1))[0]);
			}
    	}
	}
}*/

/**
 * Create the Ship object that the player controls. The ship is
 * drawn on the "ship" canvas and uses dirty rectangles to move
 * around the screen.
 */
function Ship() {
	this.speed = 5;
	this.bulletPool = new Pool(30);
	this.bulletPool.init("bullet");
	var fireRate = 15;
	var counter = 0;
	
	this.draw = function() {
		this.context.drawImage(imageRepository.spaceship, this.x, this.y);
	};
	this.move = function() {	
		counter++;
		// Determine if the action is move action
		if (KEY_STATUS.left || KEY_STATUS.right ||
			KEY_STATUS.down || KEY_STATUS.up) {
			// The ship moved, so erase it's current image so it can
			// be redrawn in it's new location
			this.context.clearRect(this.x, this.y, this.width, this.height);
			
			// Update x and y according to the direction to move and
			// redraw the ship. Change the else if's to if statements
			// to have diagonal movement.
			if (KEY_STATUS.left) {
				this.x -= this.speed
				if (this.x <= 0) // Keep player within the screen
					this.x = 0;
			} else if (KEY_STATUS.right) {
				this.x += this.speed
				if (this.x >= this.canvasWidth - this.width)
					this.x = this.canvasWidth - this.width;
			} else if (KEY_STATUS.up) {
				this.y -= this.speed
				if (this.y <= this.canvasHeight/20)
					this.y = this.canvasHeight/20;
			} else if (KEY_STATUS.down) {
				this.y += this.speed
				if (this.y >= this.canvasHeight - this.height)
					this.y = this.canvasHeight - this.height;
			}
			
			// Finish by redrawing the ship
			this.draw();
		}
		
		if (KEY_STATUS.space && counter >= fireRate) {
			this.fire();
			counter = 0;
		}
		
		if (KEY_STATUS.q) {
			game.badend();
		}
		if (level == 12) {
			game.goodend();
		}
		if (KEY_STATUS.r) {
			restart();
		}
		if (!RUN && KEY_STATUS.r) {
			restart();
		}
	};
	
	/*
	 * Fires two bullets
	 */
	this.fire = function() {
		this.bulletPool.getTwo(this.x+28, this.y, 3,
		                       this.x+52, this.y, 3);
	};
	//Collision();
}
Ship.prototype = new Drawable();

/**
 * Create the Meteor object. 
 */
var mx = 100;
var my = -imageRepository.meteor.height;
var mspeed = 2;
function Meteor() {
	var percentFire = .01;
	var chance = 0;
	this.alive = false;
	/*
	 * Sets the Meteor values
	 */
	this.spawn = function(x, y, speed) {
		mx = x;
		my = y;
		mspeed = speed;
		this.alive = true;
	};
    //Meteor has a chance to shoot every movement
	this.draw = function() {
		chance = Math.floor(Math.random()*500);
		if (chance/100 < percentFire) {
			this.fire();
		}
	};
	/*
	 * Meteor drop point
	 */
	this.fire = function() {
		game.asteroidPool.get(Math.floor(Math.random()*960), 30, -2.5/*, asteroid*/);
	}
}
Meteor.prototype = new Drawable();

 /**
 * Creates the Game object which will hold all objects and data for
 * the game.
 */
function Game() {
	/*
	 * Gets canvas information and context and sets up all game
	 * objects. 
	 * Returns true if the canvas is supported and false if it
	 * is not. This is to stop the animation script from constantly
	 * running on browsers that do not support the canvas.
	 */
	this.init = function() {
		// Get the canvas elements
		this.bgCanvas = document.getElementById('background');
		this.shipCanvas = document.getElementById('ship');
		this.mainCanvas = document.getElementById('main');
		
		// Test to see if canvas is supported. Only need to
		// check one canvas
		if (this.bgCanvas.getContext) {
			this.bgContext = this.bgCanvas.getContext('2d');
			this.shipContext = this.shipCanvas.getContext('2d');
			this.mainContext = this.mainCanvas.getContext('2d');
		
			// Initialize objects to contain their context and canvas
			// information
			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;
			
			Ship.prototype.context = this.shipContext;
			Ship.prototype.canvasWidth = this.shipCanvas.width;
			Ship.prototype.canvasHeight = this.shipCanvas.height;
			
			Bullet.prototype.context = this.mainContext;
			Bullet.prototype.canvasWidth = this.mainCanvas.width;
			Bullet.prototype.canvasHeight = this.mainCanvas.height;
			
			Meteor.prototype.context = this.mainContext;
			Meteor.prototype.canvasWidth = this.mainCanvas.width;
			Meteor.prototype.canvasHeight = this.mainCanvas.height;
			
			// Initialize the background object
			this.background = new Background();
			this.background.init(0,0); // Set draw point to 0,0
			
			//initialize score and username
			this.drawEnemy = new drawEnemy();
			this.drawEnemy.init(0,0);
			this.drawScore = new drawScore();
			this.drawUsername = new drawUsername();
						
			// Initialize the ship object
			this.ship = new Ship();
			// Set the ship to start near the bottom middle of the canvas
			var shipStartX = this.shipCanvas.width/1.85 - imageRepository.spaceship.width;
			var shipStartY = this.shipCanvas.height/1.92 + imageRepository.spaceship.height*2;
			this.ship.init(shipStartX, shipStartY, imageRepository.spaceship.width,
			               imageRepository.spaceship.height);
			
			// Initialize the meteor pool object
			this.meteorPool = new Pool(18);
			this.meteorPool.init("meteor");
			var height = imageRepository.meteor.height;
			var width = imageRepository.meteor.width;
			mx = 100;
			my = -height;
			var spacer = my * 1.5;
			for (var i = 1; i <= 18; i++) {
				this.meteorPool.get(mx,my,2/*,meteor*/);
				mx += width + 25;
				if (i % 6 == 0) {
					mx = 100;
					my += spacer
				}
			}
			this.asteroidPool = new Pool(50);
			this.asteroidPool.init("asteroid");

			return true;
		} else {
			return false;
		}
	};
	// Start the animation loop
	this.start = function() {
		this.ship.draw();
		animate();
	};
	// End the animation loop and print "Game Over"
	this.badend = function() {
		quit();
	}
	this.goodend = function() {
		win();
	}
}

/**
 * The animation loop. Calls the requestAnimationFrame shim to
 * optimize the game loop and draws all game objects. This
 * function must be a gobal function and cannot be within an
 * object.
 */
function animate() {
	if(RUN) {
		//requestAnimFrame( animate );
		//game.background.draw();
		game.meteorPool.animate();
		game.asteroidPool.animate();
		//game.ship.move();
		game.drawEnemy.draw();
		game.ship.bulletPool.animate();
		game.drawUsername.draw();
		game.drawScore.draw();
	}
	requestAnimFrame( animate );
	game.background.draw();
	game.ship.move();
}
function quit() {
	RUN = false;
	var username = getQueryVariable("username")
	var canvas = document.getElementById("main");
  	var context = canvas.getContext("2d");
    context.font = "lighter italics 20px Courier New";
    context.fillStyle = "white";
    context.clearRect(0, 0, 960, 626);
    context.fillText("GAME OVER", 423, 163);
    context.fillText("Username: " + username, 365, 213, 225);
    context.fillText("Level: " + level, 395, 263, 165);
    context.fillText("Score: " + score, 395, 313, 165);
    context.fillText("Press 'R' to Restart", 355, 363);
}
function win() {
	RUN = false;
	var username = getQueryVariable("username")
	var canvas = document.getElementById("main");
  	var context = canvas.getContext("2d");
    context.font = "lighter italics 20px Courier New";
    context.fillStyle = "white";
    context.clearRect(0, 0, 960, 626);
    context.fillText(" YOU WIN ", 423, 163);
    context.fillText("Username: " + username, 365, 213, 225);
    //context.fillText("Level: " + level, 395, 263, 165);
    context.fillText("Score: " + score, 395, 263, 165);
    context.fillText("Press 'R' to Restart", 355, 313);
}
function restart() {
	location.reload();
}

// The keycodes that will be mapped when a user presses a button.
// Original code by Doug McInnes
KEY_CODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  81: 'q',
  82: 'r',
}

// Creates the array to hold the KEY_CODES and sets all their values
// to false. Checking true/flase is the quickest way to check status
// of a key press and which one was pressed when determining
// when to move and which direction.
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[KEY_CODES[code]] = false;
}

document.onkeydown = function(e) {
  // Firefox and opera use charCode instead of keyCode to
  // return which key was pressed.
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
	e.preventDefault();
	KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
}
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
}

/**	
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop, 
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();