if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	return function() {
		var WIDTH = window.innerWidth;
		var HEIGHT = window.innerHeight;
		var scene = new THREE.Scene();

		//cameras
		var birdsEyeOrtho = new THREE.OrthographicCamera(WIDTH / - 1.2, WIDTH / 1.2, HEIGHT / 1.2, HEIGHT / - 1.2, 1, 1000);
		birdsEyeOrtho.position.z = 1000;
		var isoOrtho = new THREE.OrthographicCamera(WIDTH / - 1.2, WIDTH / 1.2, HEIGHT / 1.2, HEIGHT / - 1.2, 1, 4000);
		isoOrtho.position.y = -500;
		isoOrtho.position.z = 900;
		isoOrtho.rotation.x = 0.3 * Math.PI / 2;
		var isoPers = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 1, 10000);
		isoPers.position.y = -500;
		isoPers.position.z = 900;
		isoPers.rotation.x = 0.3 * Math.PI / 2;
		var angledPers = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 1, 10000);
		angledPers.position.y = -800;
		angledPers.position.z = 600;
		angledPers.rotation.x = 0.6 * Math.PI / 2;
		var sidePers = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 1, 10000);
		sidePers.position.y = -900;
		sidePers.position.z = 100;
		sidePers.rotation.x =  Math.PI / 2;
		var cameras = [ birdsEyeOrtho, isoOrtho, isoPers, angledPers, sidePers ];
		var cameraIndex = 0;
		var camera = cameras[cameraIndex];

		//player
		var playerGeometry = new THREE.CylinderGeometry(100, 100, 100, 50, 1, false);
		var playerMaterial = new THREE.MeshLambertMaterial({
			color: 'blue' 
		});
		var playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
		playerMesh.castShadow = true;
		playerMesh.rotation.x += Math.PI / 2;
		playerMesh.position.z = 50.05;
		scene.add(playerMesh);
		var renderer = new THREE.WebGLRenderer();
		renderer.setClearColor(0xffffff, 1);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMapEnabled = true;
		renderer.shadowMapCullFace = THREE.CullFaceBack;
		document.body.appendChild(renderer.domElement);

		//background plane
		var planeGeometry = new THREE.PlaneGeometry(1000, 1000);
		var planeMaterial = new THREE.MeshLambertMaterial({
			color: 0xffee99 
		});
		var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
		scene.add(planeMesh);
		planeMesh.receiveShadow = true;

		//drag plan
		var dragGeometry = new THREE.PlaneGeometry(1000, 1000);
		var dragMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: "red" });
		var dragMesh = new THREE.Mesh(dragGeometry, dragMaterial);
		dragMesh.position.z = 50;
		scene.add(dragMesh);

		//lighting
		var ambientLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5); 
		scene.add(ambientLight);
		var light = new THREE.DirectionalLight(0xffffff, 0.5);
		light.position.x = 2000;
		light.position.y = 0;
		light.position.z = 1000;
		light.castShadow = true;
		light.shadowDarkness = 1.0;
		//light.shadowCameraVisible = true;
		light.shadowCameraNear = 1;
		light.shadowCameraLeft = -1000;
		light.shadowCameraRight = 1000;
		light.shadowCameraTop = 1000;
		light.shadowCameraBottom = -1000;
		light.shadowMapWidth = 2048;
		light.shadowMapHeight = 2048;
		scene.add(light);

		//loop
		function eachFrame(ms, time) {
			var s = ms / 1000;
			var isMovingDiagonal = (horizontalMove !== 0 && verticalMove !== 0);
			var mult = isMovingDiagonal ? DIAGONAL_MULTIPLIER : 1;
			playerMesh.position.x += MOVE_SPEED * mult * horizontalMove * s;
			playerMesh.position.y += MOVE_SPEED * mult * verticalMove * s;
			if(playerMesh.position.x < -400) {
				playerMesh.position.x = -400;
			}
			else if(playerMesh.position.x > 400) {
				playerMesh.position.x = 400;
			}
			if(playerMesh.position.y < -400) {
				playerMesh.position.y = -400;
			}
			else if(playerMesh.position.y > 400) {
				playerMesh.position.y = 400;
			}
			renderer.render(scene, camera);
		}
		var prevTime;
		requestAnimationFrame(function(time) {
			prevTime = time;
			loop(time);
		});
		function loop(time) {
			eachFrame(time - prevTime, time);
			prevTime = time;
			requestAnimationFrame(loop);
		}

		//movement
		var horizontalMove = 0;
		var verticalMove = 0;
		var DIAGONAL_MULTIPLIER = 1 / Math.sqrt(2);
		var MOVE_SPEED = 800;

		//keyboard
		function onKeyChange(key, pressed) {
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
			else if(key === 'C' && !pressed) {
				cameraIndex = (cameraIndex + 1) % cameras.length;
				camera = cameras[cameraIndex];
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
			68: 'D',
			67: 'C'
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

		//click handler
		var isDraggingOffOfPlayer = false;
		var projector = new THREE.Projector();
		document.addEventListener('mousedown', function(evt) {
			evt.preventDefault();
			var mouseVector = new THREE.Vector3();
			mouseVector.x = 2 * (evt.clientX / WIDTH) - 1;
			mouseVector.y = 1 - 2 * (evt.clientY / HEIGHT);
			var raycaster = projector.pickingRay(mouseVector.clone(), camera);
			var intersects = raycaster.intersectObject(playerMesh);
			for(var i = 0; i < intersects.length; i++) {
				var intersection = intersects[i];
				obj = intersection.object;
				obj.material.color.setHex(Math.random() * 0xffffff);
				isDraggingOffOfPlayer = true;
			}
		}, false);
		document.addEventListener('mouseup', function(evt) {
			evt.preventDefault();
			if(isDraggingOffOfPlayer) {
				isDraggingOffOfPlayer = false;
				var mouseVector = new THREE.Vector3();
				mouseVector.x = 2 * (evt.clientX / WIDTH) - 1;
				mouseVector.y = 1 - 2 * (evt.clientY / HEIGHT);
				var raycaster = projector.pickingRay(mouseVector.clone(), camera);
				var intersects = raycaster.intersectObject(dragMesh);
				for(var i = 0; i < intersects.length; i++) {
					var intersection = intersects[i];
					var point = intersection.point;
					var diffX = point.x - playerMesh.position.x;
					var diffY = point.y - playerMesh.position.y;
					console.log(diffX, diffY);
				}
			}
		}, false);
	};
});