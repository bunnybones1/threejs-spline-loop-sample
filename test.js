var onReady = function() {
	var View = require('threejs-managed-view').View;
	var splineLoop = require('./');
	var view = new View();
	var scene = view.scene;

	var colorCameraRail = 0x7fafff;
	var colorCameraRailOld = 0xff7f7f;
	var ballGeometry = new THREE.SphereGeometry(.15);
	var railPointHelperMaterial = new THREE.MeshBasicMaterial({
		color: colorCameraRail,
		depthTest: false,
		transparent: true
	});

	var railPoints = [];
	var railPointHelpers = [];
	var railPointsTotal = 8;
	var radius = 4;
	view.camera.updateMatrixWorld();

	for (var i = 0; i < railPointsTotal; i++) {
		var ratio = i / railPointsTotal;
		var radian = ratio * Math.PI * 2;
		var railPoint = new THREE.Vector3();
		railPoint.set(
			Math.cos(radian) * radius,
			1,
			Math.sin(radian) * radius
		);
		railPoint.x += Math.random() - .5;
		railPoint.y += Math.random() - .5;
		railPoint.z += Math.random() - .5;
		var railPointHelper = new THREE.Mesh(ballGeometry, railPointHelperMaterial);
		scene.add(railPointHelper);
		railPointHelper.renderDepth = 1;
		railPointHelper.position.copy(railPoint);
		railPointHelper.point = railPoint;
		railPoints.push(railPoint);
		railPointHelpers.push(railPointHelper);
		railPointHelper.updateMatrix();
		railPointHelper.updateMatrixWorld();
	};

	var splineSegs = 100;
	var spline = new THREE.Spline(railPoints);
	splineLoop(spline);
	var splineGeometry = new THREE.Geometry();
	var splineGeometryOld = new THREE.Geometry();

	var splineMaterial = new THREE.LineBasicMaterial({
	    color: colorCameraRail
	});

	var splineMaterialOld = new THREE.LineBasicMaterial({
	    color: colorCameraRailOld
	});

	spline.cache(100);
	for (var i = 0; i < splineSegs; i++) {
		// var coord = spline.getPoint(i/splineSegs);
		var coord = spline.getCachedLoopPoint(i/splineSegs);
		var coordOld = spline.getPoint(i/splineSegs);
		var vert = new THREE.Vector3(coord.x, coord.y, coord.z);
		var vertOld = new THREE.Vector3(coordOld.x, coordOld.y, coordOld.z);
		splineGeometry.vertices.push(vert);
		splineGeometryOld.vertices.push(vertOld);
	};
	var splineMesh = new THREE.Line(splineGeometry, splineMaterial);
	scene.add(splineMesh);
	var splineMeshOld = new THREE.Line(splineGeometryOld, splineMaterialOld);
	scene.add(splineMeshOld);
	splineMeshOld.position.y += .0125;

	var movingPointHelper = railPointHelpers[2];
	samplePosition = movingPointHelper.position.clone();
	var movement = new THREE.Vector3();
	view.renderManager.onEnterFrame.add(function() {
		var time = (new Date()).getTime() * .001;
		movement.set(
			Math.cos(time),
			Math.sin(time),
			Math.cos(time)
		)
		movingPointHelper.position.copy(samplePosition).add(movement);
		movingPointHelper.point.copy(movingPointHelper.position);
		for (var i = 0; i < splineSegs; i++) {
			// var coord = spline.getPoint(i/splineSegs);
			var coord = spline.getCachedLoopPoint(i/splineSegs);
			var coordOld = spline.getPoint(i/splineSegs);
			var vert = new THREE.Vector3(coord.x, coord.y, coord.z);
			var vertOld = new THREE.Vector3(coordOld.x, coordOld.y, coordOld.z);
			spline.updateCache();
			splineGeometry.vertices[i].copy(vert);
			splineGeometryOld.vertices[i].copy(vertOld);
			splineGeometry.verticesNeedUpdate = true;
			splineGeometryOld.verticesNeedUpdate = true;
		};
	})

}

var loadAndRunScripts = require('loadandrunscripts');
loadAndRunScripts(
	[
		'bower_components/three.js/three.js'
	],
	onReady
);