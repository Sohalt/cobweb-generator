"use strict";
function randFloatRange(min, max) {
    return min + Math.random() * (max-min);
}

function randIntRange(min, max){
    return Math.floor(0.5 + randFloatRange(min,max));
}

function cobweb(canvas, {maxRadials = 20,
                         minRadials = 10,
                         maxRings = 20,
                         minRings = 10,
                         radials = randIntRange(minRadials, maxRadials),
                         rings = randIntRange(minRings, maxRings),
                         radius = undefined ,
                         radialRandomness = 1.5, // positive float: 1 -> all equidistant, higher numbers -> more random spacing
                         ringRandomness = 2.5, // positive integer: 1 -> all equidistant, higher numbers -> more random spacing
                         curvature = 0.9, // float between 0 and 1: 1 -> straight, 0 -> maximum curvature
                         center = undefined,
                         drops = 0.05, // average amount of water drops per 1 unit of length
                         minDropRadius = 3,
                         maxDropRadius = 5}
                = {}){
    paper.setup(canvas);

    radius = radius != undefined ? radius : Math.min(paper.view.size.width, paper.view.size.height)/2;
    center = center != undefined ? center : paper.view.center;

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
        ring.curves.forEach((c) => {
            let d = Math.floor(c.length * drops);
            for(var i = 0; i < d; i++){
                let offset = Math.random(),
                    loc = c.getLocationAtTime(offset);
                drop(loc.point);
            }
        });
    });

    let layer = paper.project.activeLayer;
    layer.translate(center);

    paper.view.draw();

    function drop(location, radius = randFloatRange(minDropRadius, maxDropRadius)) {
        let drop = new paper.Path.Circle(location, radius);
        drop.strokeColor = 'black';
        drop.fillColor = 'black';
        let spec1 = drop.clone();
        spec1.scale(0.7);
        let spec2 = spec1.clone();
        spec2.translate([2,2]);
        let spec = spec1.subtract(spec2);
        spec1.remove();
        spec2.remove();
        spec.fillColor = 'white';
    }

    function randomSegments(n, randomness = 1) {
        let sum = 0;
        let segments = [];
        for(let i = 0; i < n; i++) {
            let r = randFloatRange(1,randomness);
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
