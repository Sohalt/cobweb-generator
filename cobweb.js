"use strict";
function cobweb(canvas, options){
    paper.setup(canvas);

    let maxRadials = 20,
        minRadials = 10,
        maxRings = 20,
        minRings = 10,
        radials = Math.floor(Math.random()*(maxRadials-minRadials)+minRadials),
        rings = Math.floor(Math.random()*(maxRings-minRings)+minRings),
        size = paper.view.size,
        radius = Math.min(size.width, size.height)/2,
        radialRandomness = 1.5, // positive float: 1 -> all equidistant, higher numbers -> more random spacing
        ringRandomness = 2.5, // positive integer: 1 -> all equidistant, higher numbers -> more random spacing
        curvature = 0.8, // float between 0 and 1: 1 -> straight, 0 -> maximum curvature
        center = paper.project.view.center;

    let angles = randomSegments(radials, radialRandomness).map((a) => a * 360);
    let radii = randomSegments(rings, ringRandomness).map((r)=> r * radius);

    angles.forEach((angle) => {
        let start = new paper.Point(),
            end = new paper.Point();
        end.angle = angle;
        end.length = radius;
        new paper.Path({segments: [start, end],
                        strokeColor: 'black'});
    });

    radii.forEach((radius) => {
        let ring = new paper.Path();
        ring.strokeColor = 'black';
        var p1 = new paper.Point();
        p1.angle = angles[0];
        p1.length = radius;
        ring.moveTo(p1);
        for(var i = 1; i <= radials; i++){
            let p2 = new paper.Point();
            p2.angle = angles[i%radials];
            p2.length = radius;
            let p3 = p1.add(p2).divide(2);
            p3.length *= curvature;
            ring.curveTo(p3,p2);
            p1 = p2;
        };
    });

    let layer = paper.project.activeLayer;
    layer.translate(center);
    console.log(paper.view);

    paper.view.draw();


    function randomSegments(n, randomness = 1) {
        let sum = 0;
        let segments = [];
        for(let i = 0; i < n; i++) {
            let r = 1 + Math.floor(Math.random()*randomness);
            segments.push(r);
            sum += r;
        }
        let acc = 0;
        for(let i = 0; i < n; i++) {
            acc = segments[i]/sum + acc;
            segments[i] = acc;
        }
        return segments;
    }
}
