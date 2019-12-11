"use strict";
function cobweb(canvas, options){
    let radials = 15,
        rings = 10,
        radius = Math.min(canvas.width, canvas.height)/2,
        radialRandomness = 1,
        ringRandomness = 1,
        curvature = 1,
        center = new paper.Point(radius,radius);
    paper.setup(canvas);

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
        ring.closed = true;
        angles.forEach((angle) => {
            let p = new paper.Point();
            p.angle = angle;
            p.length = radius;
            ring.add(p);
        });
    });

    let layer = paper.project.activeLayer;
    layer.translate(paper.project.view.center);

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
