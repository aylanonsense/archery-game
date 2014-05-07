if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	return function() {
		var START_TIME;
		var PREV_TIME;
		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
		camera.position.z = 1000;
		var geometry = new THREE.CylinderGeometry(100, 100, 400, 50, 50, false);
		var material = new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: true });
		var mesh = new THREE.Mesh(geometry, material);
		mesh.rotation.x += Math.PI / 2;
		scene.add(mesh);
		var renderer = new THREE.WebGLRenderer();
		renderer.setClearColor( 0xffffff, 1);
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
		function eachFrame(ms, time) {
			renderer.render(scene, camera);
		}
		requestAnimationFrame(function(time) {
			PREV_TIME = Date.now();
			START_TIME = PREV_TIME - time;
			loop(time);
		});
		function loop(time) {
			time += START_TIME;
			var ms = time - PREV_TIME;
			PREV_TIME = time;
			eachFrame(ms, time);
			window.requestAnimationFrame(loop);
		}
	};
});