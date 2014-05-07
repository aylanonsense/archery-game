if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	return function() {
		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
		camera.position.z = 1000;
		var geometry = new THREE.BoxGeometry(200, 200, 200);
		var material = new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: true });
		var mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);
		var renderer = new THREE.WebGLRenderer();
		renderer.setClearColor( 0xffffff, 1);
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
		animate();
		function animate() {
			requestAnimationFrame(animate);
			mesh.rotation.x += 0.01;
			mesh.rotation.y += 0.02;
			renderer.render(scene, camera);
		}
	};
});