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

		//renderer
		var renderer = new THREE.WebGLRenderer();
		renderer.setClearColor(0xffffff, 1);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMapEnabled = true;
		renderer.shadowMapCullFace = THREE.CullFaceBack;
		document.body.appendChild(renderer.domElement);

		//renderer stats
		var polyStats = new THREEx.RendererStats();
		polyStats.domElement.style.position = 'absolute';
		polyStats.domElement.style.left = '0px';
		polyStats.domElement.style.bottom = '0px';
		polyStats.domElement.style.width = '110px';
		document.body.appendChild(polyStats.domElement);
		var fpsStats = new Stats();
		fpsStats.setMode(0);
		fpsStats.domElement.style.position = 'absolute';
		fpsStats.domElement.style.left = '112px';
		fpsStats.domElement.style.bottom = '0px';
		document.body.appendChild(fpsStats.domElement);
		var msStats = new Stats();
		msStats.setMode(1);
		msStats.domElement.style.position = 'absolute';
		msStats.domElement.style.left = '193px';
		msStats.domElement.style.bottom = '0px';
		document.body.appendChild(msStats.domElement);

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
		var isLightOn = true;
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
			fpsStats.begin();
			msStats.begin();
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
			for(var i = 0, len = arrows.length; i < len; i++) {
				arrows[i].mesh.position.x += arrows[i].velocity.x * s;
				arrows[i].mesh.position.y += arrows[i].velocity.y * s;
				arrows[i].mesh.position.z += arrows[i].velocity.z * s;
			}
			renderer.render(scene, camera);
			polyStats.update(renderer);
			msStats.end();
			fpsStats.end();
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
			else if(key === 'L' && !pressed) {
				isLightOn = !isLightOn;
				if(!isLightOn) {
					scene.remove(light);
				}
				else {
					scene.add(light);
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
			68: 'D',
			67: 'C',
			76: 'L'
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
					fireArrow(playerMesh.position.x, playerMesh.position.y, diffX, diffY);
				}
			}
		}, false);

		//projectiles
		var arrowMaterial = new THREE.MeshLambertMaterial({
			color: 'green'
		});
		var arrows = [];
		var GRAVITY = -800;
		function determineArrowStartingVelocity(squareDist) {
			//squareDist is probably somewhere between 10k and 100k
			//output should probably be somwehere between 1000 and 3500
			if(squareDist > 100000) {
				squareDist = 100000;
			}
			else if(squareDist < 10000) {
				squareDist = 10000;
			}
			return 1000 + 2500 * (squareDist - 10000) / (100000 - 10000);
		}
		function fireArrow(x, y, dirX, dirY) {
			var squareDistDragged = dirX * dirX + dirY * dirY;
			var moveSpeed = determineArrowStartingVelocity(squareDistDragged);
			dirX *= -1;
			dirY *= -1;
			var arrowGeometry = new THREE.CylinderGeometry(5, 5, 50, 10, 1, false);
			var arrowMesh = new THREE.Mesh(arrowGeometry, arrowMaterial);
			arrowMesh.castShadow = true;
			arrowMesh.position.x = playerMesh.position.x;
			arrowMesh.position.y = playerMesh.position.y;
			arrowMesh.position.z = 50.05;
			var angle = Math.atan2(dirY, dirX);
			arrowMesh.rotation.z = angle + Math.PI / 2;
			scene.add(arrowMesh);
			var dirVector = new THREE.Vector3();
			dirVector.x = dirX;
			dirVector.y = dirY;
			dirVector.normalize();
			dirVector.multiplyScalar(moveSpeed);
			arrows.push({
				mesh: arrowMesh,
				velocity: dirVector
			});
		}
	};
});