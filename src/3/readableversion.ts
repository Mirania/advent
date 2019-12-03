import * as fs from 'fs';

//not necessarily equivalent to part1 or part2's code
//also much slower than part1 and part2's code

type Point = {x: number, y: number, steps: number};

fs.readFile("src/3/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    let wires = text.split("\n").map((w)=>w.split(","));
    let w0 = [{x: 0, y: 0, steps: 0}], w1 = [{x: 0, y: 0, steps: 0}];
    
    wires[0].forEach(coord => add(coord, w0));
    wires[1].forEach(coord => add(coord, w1));

    console.log("Part 1:",
        Math.min(...w0.filter(point => includes(point, w1)>-1).map(point => manhattan(point))));
    console.log("Part 2:",
        Math.min(...w0.filter(point => includes(point, w1)>-1).map(point => totalsteps(point, w1))));
});

function add(coord: string, wire: Point[]): void {
    let ref = wire[wire.length-1], 
        dir = coord.substring(0,1), 
        steps = parseInt(coord.substring(1, coord.length));

    for (let i=1; i<=steps; i++) {
        switch (dir) {
            case "U": wire.push({x: ref.x, y: ref.y+i, steps: ref.steps+i }); break;
            case "D": wire.push({x: ref.x, y: ref.y-i, steps: ref.steps+i }); break;
            case "L": wire.push({x: ref.x-i, y: ref.y, steps: ref.steps+i }); break;
            case "R": wire.push({x: ref.x+i, y: ref.y, steps: ref.steps+i }); break;
        }
    }
}

function includes(point: Point, array: Point[]): number {
    for (let i=0; i<array.length; i++) {
        if (point.x===array[i].x && point.y===array[i].y) return i;
    }
    return -1;
}

function manhattan(point: Point): number {
    if (point.x===0 && point.y===0) return Infinity;
    return Math.abs(point.x) + Math.abs(point.y);
}

function totalsteps(point: Point, otherArray: Point[]): number {
    let amount = point.steps + otherArray[includes(point, otherArray)].steps;
    return amount===0 ? Infinity : amount;
}