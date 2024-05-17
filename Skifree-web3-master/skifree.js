/**
 * Skifree clone using JavaScript and HTML5 <canvas>
 * orgin game code from Andrew Mason (andrew@coderonfire.com)
 * edited by Horden
 */


function Startgame(){
    for(var i=0;i<3;i++) {
        for(var k=0;k<3;k++){
            document.getElementById(i+"_"+k+"_btn").style.display = "none";
        }
    }





    var SKI = (function () {



        /**
         * Initialise game variables.
         */
        var canvas = document.querySelector('canvas'),
            ctx = canvas.getContext('2d'),
            maxTrees = 40,
            fps = 1000 / 30,
            gameInterval,
            treeCount = 20,
            rockCount = 10,
            spriteMapImg,
            spriteMapImgSrc = CurrentspriteMapImg(),
            crashed,
            invincibilityCount = 0,
            debug = true,
            score = 0;

        /**
         * User class.
         */
        var User = function () {
            var speed,
                position,
                spriteMap = {
                    'down': {'x': 0, 'y': 0},
                    'left': {'x': 16, 'y': 0},
                    'right': {'x': 32, 'y': 0},
                    'fullLeft': {'x': 48, 'y': 0},
                    'fullRight': {'x': 64, 'y': 0},
                    'crashed': {'x': 80, 'y': 0}
                },
                maxSpeed,
                currentSpeed,
                acceleration = 0.3,
                faster,
                paused,
                drag = 0.8,
                stopped = true,
                distance = 0,
                height = 32,
                width = 16;
            angle = 0;

            /**
             * Set the user up at the beginning of the game.
             */
            function init() {
                speed = {'x': 0, 'y': 0};
                position = {
                    'x': canvas.width / 2,
                    'y': 100
                };
                currentSpeed = 0;
                maxSpeed = BaseSpeed();
                reward_bonusx=CurrentBounus();
                faster = false;
                stopped = true;
            };

            /**
             * Handle when the user crashes.
             */
            function crash() {
                init();
                invincibilityCount = 15;
                ctx.font = "20px Georgia";
                ctx.fillText("Game Over!", (canvas.width / 2) - 100, canvas.height / 2);
                ctx.fillText("You'll recieve " + Math.floor(distance*reward_bonusx / 200) + " token"+"  Bounus"+reward_bonusx+"x", (canvas.width / 2) - 150, canvas.height / 2 + 50);

                console.log("crash");
                crashed = true;
                paused = true;
                alert(distance*reward_bonusx);
                score=Math.floor(distance*reward_bonusx)
                EndGame_getToken(score);//呼叫結算合約
                //canva.style.display="none";

                // Pause the player for a while
                //  setTimeout(function(){
                //      paused = false;
                //  }, 5000);
            }

            /**
             * Draw the user stats and sprite image onto the canvas
             */
            function draw() {
                var spriteFrame = getSpriteFrame();

                // Draw the player sprite
                ctx.drawImage(
                    spriteMapImg,
                    spriteMap[spriteFrame].x,
                    spriteMap[spriteFrame].y,
                    width,
                    height,
                    position.x,
                    position.y,
                    width,
                    height
                );

                // Draw the stats
                drawStats();
            };

            /**
             * What spritemap frame should be drawn.
             * @return {string}
             */
            function getSpriteFrame() {
                if (crashed) {
                    return 'crashed';
                } else if (angle > 0.8) {
                    return 'fullRight';
                } else if (angle > 0.3) {
                    return 'right';
                } else if (angle < -0.8) {
                    return 'fullLeft';
                } else if (angle < -0.3) {
                    return 'left';
                }

                return 'down';
            };

            /**
             * Change the user's speed based upon mouse position.
             */
            function move() {
                // TODO: Logic here is a bit ugly and needs cleaning up
                if (stopped && currentSpeed <= 0) {
                    return;
                } else if (stopped && currentSpeed > 0) {
                    currentSpeed = (currentSpeed - drag < 0) ? 0 : currentSpeed - drag;
                } else if (currentSpeed < maxSpeed) {
                    currentSpeed += acceleration;
                    if (currentSpeed > maxSpeed) {
                        currentSpeed = maxSpeed;
                    }
                } else if (currentSpeed > maxSpeed) {
                    currentSpeed -= drag;
                }

                // Calulate speed vectors
                speed.x = Math.sin(angle) * (currentSpeed / 2);
                speed.y = Math.cos(angle) * currentSpeed;

                // Decrese invincibility
                if (!crashed && invincibilityCount > 0) {
                    invincibilityCount -= 1;
                }

                // Update distance
                updateDistance();
                //document.getElementById("mytext").value = distance;//顯示目前的距離
            };

            /**
             * Update the user's movement based on mouse position.
             * @param {Object} event
             */
            function mouseMove(event) {
                // Do nothing is user is paused
                if (paused) {
                    return;
                }

                var mouseX,
                    mouseY,
                    distX,
                    distY,
                    pos;

                // Reset crashed status if needed
                //	if (crashed) {
                //		crashed = false;
                //	}

                // Get the location of the mouse
                // Firefox doesn't have event offsetX/Y so we need to calc it.
                if (typeof event.offsetX === 'undefined') {
                    mouseX = event.pageX - event.target.offsetLeft;
                    mouseY = event.pageY - event.target.offsetTop;
                } else {
                    mouseX = event.offsetX;
                    mouseY = event.offsetY;
                }

                // calculate angle of mouse relative to the user
                pos = getHitPosition();
                distX = pos.x - mouseX;
                distY = pos.y - mouseY;

                // Stop moving is mouse is above user
                if (distY >= 0) {
                    //direction = 0;
                    stopped = true;
                    return;
                }

                // Reset motion flag
                stopped = false;

                // Work out set angles
                angle = Math.atan(distX / distY);
                if (Math.abs(angle) > 1.1) {
                    stopped = true;
                    return;
                } else if (Math.abs(angle) > 0.8) {
                    angle = 1.1;
                } else if (Math.abs(angle) > 0.3) {
                    angle = 0.8
                } else if (Math.abs(angle) < 0.3) {
                    angle = 0;
                }

                // Set angle direction
                angle *= (distX > 0) ? -1 : 1;

            };

            /**
             * Alter game based on what key was pressed.
             *
             * @param {event} event Event object.
             */
            function keyPressed(event) {
                // Check that a valid keyCode was passed in
                if (!event.keyCode || event.keyCode === 'undefined') {
                    return;
                }

                // Which key was pressed?
                switch (event.keyCode) {
                    case 102: // the F key presssed. Change the speed.
                        faster = (faster) ? false : true;
                        if (faster) {
                            maxSpeed *= 2;
                        } else {
                            maxSpeed /= 2;
                        }
                        break;
                }
                ;
            }

            /**
             * Jump when user clicks the mouse
             *
             * @param {event} event Mouse click event.
             */
            function mouseClicked(event) {
                // console.log('jump');
            }

            /**
             * Increases the players distance.
             */
            function updateDistance() {
                distance += speed.y / 25;
            }

            /**
             * Draws player statistics to the canvas.
             * This function is pretty messy atm but it gets the job done.
             */
            function drawStats() {
                var boxWidth = 110;
                var boxHeight = 30;

                ctx.lineWidth = 1;
                ctx.fillStyle = 'rgb(255, 255, 255)';
                ctx.fillRect(
                    canvas.width - boxWidth,
                    0,
                    boxWidth,
                    boxHeight
                );

                ctx.strokeRect(
                    canvas.width - boxWidth,
                    0,
                    boxWidth,
                    boxHeight
                );

                ctx.fillStyle = 'rgb(0, 0, 0)';
                ctx.textBaseline = 'top';
                ctx.font = "9pt Courier New";
                ctx.fillText(
                    'Speed = ' + Math.round(currentSpeed) + 'm/s',
                    canvas.width - (boxWidth - 2),
                    1
                );
                ctx.fillText(
                    'Distance = ' + Math.round(distance) + 'm',
                    canvas.width - (boxWidth - 2),
                    12
                );


            }

            /**
             * @return {Object} User's hit location coordinates
             */
            function getHitPosition() {
                return {
                    'x': position.x + width / 2,
                    'y': position.y + height
                };
            }

            /**
             * @return {object} User's current speed.
             */
            function getSpeed() {
                return speed;
            }

            init();

            return {
                'getHitPosition': getHitPosition,
                'getSpeed': getSpeed,
                'draw': draw,
                'move': move,
                'mouseMove': mouseMove,
                'keyPressed': keyPressed,
                'mouseClicked': mouseClicked,
                'crash': crash,
                'init': init
            }

        };

        /**
         * Entities.
         */
        var Entities = (function () {
            /**
             * Entity Create class.
             */
            var Create = function (typeName) {
                // Check that a valid entity type was passed in
                if (typeof types[typeName] !== 'object') {
                    return;
                }

                var t = types[typeName];

                // Initialise variables
                var spriteMap = t.spriteMap || 'sam',
                    collide = t.collide || null,
                    jump = t.jump || false,
                    height = t.height || 0,
                    width = t.width || 0,
                    boost = t.boost || false,
                    position = t.position || {},
                    hit = {},
                    collisionDist = t.collisionDist || 7;

                /**
                 * Draws the entity sprite to the canvas.
                 */
                function draw() {
                    // Only draw if within the viewport (canvas)
                    if (position.x + width < 0 || position.x > canvas.width) {
                        return;
                    }

                    ctx.drawImage(
                        spriteMapImg,
                        spriteMap.x,
                        spriteMap.y,
                        width,
                        height,
                        position.x,
                        position.y,
                        width,
                        height
                    );
                };

                /**
                 * Update the current position based on user's
                 * speed. Will also reset position of entity to the bottom of the
                 * canvas once it reaches the top.
                 *
                 * @param {Object} speed User's x, y speed.
                 */
                function move(speed) {
                    position.x -= speed.x;
                    position.y -= speed.y;

                    // If the entity gets too far of the view, reset it's position
                    if (position.y + height < 0) {
                        resetPosition(false, canvas.height);
                    }

                    if (position.x < -canvas.width * 2) {
                        resetPosition(canvas.width + width, false);
                    } else if (position.x > canvas.width * 3) {
                        resetPosition(-width, false);
                    }
                };

                /**
                 * Set the entitie's position.
                 *
                 * @param int x target X position
                 * @param int y target Y position
                 */
                function resetPosition(x, y) {
                    position = {
                        'x': x || (canvas.width * 3) * Math.random() - canvas.width,
                        'y': y || canvas.height * Math.random()
                    };
                };

                /**
                 * Calculates new hit location
                 */
                function updateHit() {
                    // setup hit positions
                    hit.x = position.x + width / 2;
                    hit.y = position.y + height;
                }

                /**
                 * collision method provides hit detection
                 * using distance between the entity and user
                 *
                 * @return bool
                 */
                function collision(user) {
                    // No collision if player has already crashed or
                    // entity has no collide property
                    if (!collide || crashed || invincibilityCount > 0) {
                        return false;
                    }

                    updateHit();
                    var hitWidth = width / 2;

                    var hypotenuse = Math.sqrt(
                        Math.pow(user.x - hit.x, 2)
                        + Math.pow(user.y - hit.y, 2)
                    );

                    if (hypotenuse < hitWidth) {
                        return true
                    }
                };

                function init() {
                    resetPosition();
                }

                init();

                return {
                    'draw': draw,
                    'collision': collision,
                    'move': move,
                    'spriteMap': spriteMap
                };
            };

            /**
             * Entity types.
             * Object of entities and their properties.
             */
            var types = {
                'tree': {
                    'spriteMap': {'x': 0, 'y': 32},
                    'height': 32,
                    'width': 32,
                    'collide': true
                },
                'rock': {
                    'spriteMap': {'x': 32, 'y': 32},
                    'height': 16,
                    'width': 16,
                    'collide': false
                }
            };

            return {
                'Create': Create
            };

        }());

        var Game = (function () {
            var fps = 1000 / 30,
                entityStore = [],
                tick,
                user;

            /**
             * Start the game.
             */
            function start() {
                tick = setInterval(mainLoop, fps);
            };

            /**
             * Stop the game.
             */
            function stop() {
                // Cancel the game loop
                clearInterval(tick);
            }

            /**
             * The main game loop that iterates through all the game entities
             * moving and drawing them.
             */
            function mainLoop() {
                // Clear the canvas
                if (crashed != true) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Iterate through each entity
                    var l = entityStore.length;
                    for (var i = 0; i < l; i++) {
                        entityStore[i].move(user.getSpeed());
                        entityStore[i].draw();

                        // Check if we hit something
                        if (entityStore[i].collision(user.getHitPosition())) {
                            user.crash();
                        }
                    }

                    user.move();

                    user.draw();
                }

            }

            /**
             * Intiailisation of the game and environment setup.
             */
            function init() {
                // Create a user instance
                user = new User();

                // Attach event handlers
                canvas.addEventListener('mousemove', user.mouseMove, true);
                window.addEventListener('keypress', user.keyPressed, true);
                window.addEventListener('mousedown', user.mouseClicked, true);

                // Add entities
                // TODO: merge into one loop.
                for (var i = 0; i < rockCount; i++) {
                    entityStore.push(new Entities.Create('rock'));
                }

                for (var i = 0; i < treeCount; i++) {
                    entityStore.push(new Entities.Create('tree'));
                }

                start();
            };

            return {
                'init': init,
                'stop': stop,
                'start': start
            };
        }());

        // Wait until the spritemap image has loaded then initialise the game.
        spriteMapImg = new Image();
        spriteMapImg.src = spriteMapImgSrc;
        spriteMapImg.onload = Game.init;

    }());


}