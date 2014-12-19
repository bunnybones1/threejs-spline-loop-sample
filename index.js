
// a modified spline lookup for looping splines

var c = [], v3 = { x: 0, y: 0, z: 0 },
point, intPoint, weight, w2, w3,
pa, pb, pc, pd,
len;

// Catmull-Rom

function interpolate( p0, p1, p2, p3, t, t2, t3 ) {

	var v0 = ( p2 - p0 ) * 0.5,
		v1 = ( p3 - p1 ) * 0.5;

	return ( 2 * ( p1 - p2 ) + v0 + v1 ) * t3 + ( - 3 * ( p1 - p2 ) - 2 * v0 - v1 ) * t2 + v0 * t + p1;

};

function getLoopPoint ( k ) {
	len = this.points.length;
	point = ( len ) * k;
	intPoint = Math.floor( point );
	weight = point - intPoint;

	c[ 0 ] = (intPoint + len - 1) % len;
	c[ 1 ] = intPoint;
	c[ 2 ] = (intPoint + 1) % len;
	c[ 3 ] = (intPoint + 2) % len;

	pa = this.points[ c[ 0 ] ];
	pb = this.points[ c[ 1 ] ];
	pc = this.points[ c[ 2 ] ];
	pd = this.points[ c[ 3 ] ];

	w2 = weight * weight;
	w3 = weight * w2;

	v3.x = interpolate( pa.x, pb.x, pc.x, pd.x, weight, w2, w3 );
	v3.y = interpolate( pa.y, pb.y, pc.y, pd.y, weight, w2, w3 );
	v3.z = interpolate( pa.z, pb.z, pc.z, pd.z, weight, w2, w3 );

	return v3;

};

function splineLoop(spline) {
	spline.getLoopPoint = getLoopPoint;
}

module.exports = splineLoop;