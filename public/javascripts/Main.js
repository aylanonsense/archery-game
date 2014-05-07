if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	return function() {
		var START_TIME;
		var prevTime;
		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
		camera.position.z = 1000;
		var geometry = new THREE.CylinderGeometry(100, 100, 100, 50, 1, false);
		var material = new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: false });
		var mesh = new THREE.Mesh(geometry, material);
		mesh.rotation.x += Math.PI / 2;
		scene.add(mesh);
		var renderer = new THREE.WebGLRenderer();
		renderer.setClearColor( 0xffffff, 1);
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);

		//loop
		function eachFrame(ms, time) {
			move(ms);
			renderer.render(scene, camera);
		}
		requestAnimationFrame(function(time) {
			prevTime = Date.now();
			START_TIME = prevTime - time;
			loop(time);
		});
		function loop(time) {
			time += START_TIME;
			var ms = time - prevTime;
			prevTime = time;
			eachFrame(ms, time);
			window.requestAnimationFrame(loop);
		}

		//movement
		function move(ms) {
			var s = ms / 1000;
			var isMovingDiagonal = (horizontalMove !== 0 && verticalMove !== 0);
			var mult = isMovingDiagonal ? DIAGONAL_MULTIPLIER : 1;
			mesh.position.x += MOVE_SPEED * mult * horizontalMove * s;
			mesh.position.y += MOVE_SPEED * mult * verticalMove * s;
		}
		var horizontalMove = 0;
		var verticalMove = 0;
		var DIAGONAL_MULTIPLIER = 1 / Math.sqrt(2);
		var MOVE_SPEED = 800;
		var timeOfLastMove = null;

		//keyboard
		function onKeyChange(key, pressed) {
			var now = Date.now();
			if(key === 'W') {
				if(pressed) {
					verticalMove = 1;
				}
				else {
					verticalMove = isPressed.S ? -1 : 0;
				}
			}
			else if(key === 'A') {
				if(pressed) {
					horizontalMove = -1;
				}
				else {
					horizontalMove = isPressed.D ? 1 : 0;
				}
			}
			else if(key === 'S') {
				if(pressed) {
					verticalMove = -1;
				}
				else {
					verticalMove = isPressed.W ? 1 : 0;
				}
			}
			else if(key === 'D') {
				if(pressed) {
					horizontalMove = 1;
				}
				else {
					horizontalMove = isPressed.A ? -1 : 0;
				}
			}
		}
		var isPressed = {
			W: false,
			A: false,
			S: false,
			D: false
		};
		var KEY_LOOKUP = {
			87: 'W',
			65: 'A',
			83: 'S',
			68: 'D'
		};
		$(document).on('keyup', function(evt) {
			var key = KEY_LOOKUP[evt.which];
			if(key) {
				if(isPressed[key]) {
					isPressed[key] = false;
					onKeyChange(key, false);
				}
			}
		});
		$(document).on('keydown', function(evt) {
			var key = KEY_LOOKUP[evt.which];
			if(key) {
				if(!isPressed[key]) {
					isPressed[key] = true;
					onKeyChange(key, true);
				}
			}
		});
	};
});