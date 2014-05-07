archery-game
============

A simple archery game I'm using to hone my WebGL skills.

Goals
-----
The game will have a character that can move with WASD or the arrow keys. If the player clicks the character they can drag to aim an arrow in the opposite direction. When the mouse button is released, the arrow is fired. The player attempts to shoot at targets.

Steps
-----
X	Render something, ANYTHING
X	Draw a cylinder
X	Make the cylinder move with the WASD
X	Add a background plane
X	Position the camera to be a birds eye view
X	Add lighting
X	Move camera out and zoom in to decrease effect of perspective (dolly)
	Apply a texture to the background
	Limit the player from moving out of bounds
	Detect clicks on the player
	Detect when the mouse is dragged and released
	Create an arrow when the mouse is released
	Give the arrow a model
	Make the arrow move every frame
	Make the arrow move in the direction it was fired
	Make the arrow's speed proportional to the distance the mouse was dragged
	Remove arrows that move offscreen
	Limit the arrow's max travel distance proportional to the distance the mouse was dragged
	Keep arrows that reach the maximum travel distance on screen
	Add maximum amount mouse can be dragged before aiming is canceled
	Add targets
	Make player collide with targets
	Make arrows collide with and stick in targets
	Add animation when an arrow hits a target
	Add maximum pull distance indicator when dragging
	Add current pull distance indicator when dragging
	Add maximum range indicator when dragging
	Add sound when arrow is fired, canceled, knocked, pulled too far, hits a target, or hits the ground