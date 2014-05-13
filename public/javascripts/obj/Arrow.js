if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	var MATERIAL = new THREE.MeshLambertMaterial({ color: 'green' });
	var MIN_STARTING_SPEED = 1000;
	var MAX_STARTING_SPEED = 3500;
	var LOWEST_STARTING_ANGLE = -0.03;
	var HIGHEST_STARTING_ANGLE = 0.07;
	var FALL_ACCELERATION = -800;

	function Arrow(params) {
		var cylinder = new THREE.CylinderGeometry(5, 5, 50, 10, 1, false);
		var power = params.dirX * params.dirX + params.dirY * params.dirY;
		var speed = determineStartingSpeed(power);
		this._mesh = new THREE.Mesh(cylinder, MATERIAL);
		this._mesh.castShadow = true;
		this._mesh.position.x = params.x;
		this._mesh.position.y = params.y;
		this._mesh.position.z = params.z;
		this._mesh.rotation.x += Math.PI / 2;
		this._mesh.rotation.z = Math.PI / 2; //up/down
		this._mesh.rotation.y = Math.atan2(-params.dirY, -params.dirX) + Math.PI; //parallel to plane
		params.scene.add(this._mesh);
		this._velocity = new THREE.Vector3();
		this._velocity.x = -params.dirX;
		this._velocity.y = -params.dirY;
		this._velocity.z = 0;
		this._velocity.normalize();
		this._velocity.z = determineStartingAngle(power);
		this._velocity.normalize();
		this._velocity.multiplyScalar(speed);
	}
	Arrow.prototype.eachFrame = function(ms) {
		if(this._mesh.position.z > 5) {
			var t = ms / 1000;
			this._velocity.z += FALL_ACCELERATION * t / 2;
			this._mesh.position.x += this._velocity.x * t;
			this._mesh.position.y += this._velocity.y * t;
			this._mesh.position.z += this._velocity.z * t;
			this._velocity.z += FALL_ACCELERATION * t / 2;
			var horizontalVelSquared = this._velocity.x * this._velocity.x + this._velocity.y * this._velocity.y;
			var horizontalVel = Math.sqrt(horizontalVelSquared);
			var angleToGround = Math.atan2(horizontalVel, this._velocity.z);
			this._mesh.rotation.z =  angleToGround;
		}
	};

	//helper methods
	function determineStartingSpeed(power) {
		if(power > 100000) {
			power = 100000;
		}
		else if(power < 10000) {
			power = 10000;
		}
		return MIN_STARTING_SPEED + (MAX_STARTING_SPEED - MIN_STARTING_SPEED) * (power - 10000) / 90000;
	}
	function determineStartingAngle(power) {
		if(power > 100000) {
			power = 100000;
		}
		else if(power < 10000) {
			power = 10000;
		}
		return LOWEST_STARTING_ANGLE + (HIGHEST_STARTING_ANGLE - LOWEST_STARTING_ANGLE) * (power - 10000) / 90000;
	}

	return Arrow;
});