import * as fs from 'fs';
import * as program from './intcode';

type Tile = { color: number, point?: Point };
type Point = { x: number, y: number };

fs.readFile("src/11/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    let originalcode = text.split(",").map((value) => parseInt(value));
    
    program.init(originalcode);
    let x = 0, y = 0, rotation = 90, painted: { [xy: string]: Tile } = {};
    while (true) {
        let tile = `${x},${y}`, outputs = program.cpu(painted[tile]===undefined ? 0 : painted[tile].color); //default to 0
        if (program.done()) break; 
        painted[tile] = {color: outputs[0]}, [x, y, rotation] = rotate(x, y, rotation, outputs[1]);
    }

    console.log("Part 1:", Object.keys(painted).length);

    program.init(originalcode);
    x = 0, y = 0, rotation = 90, painted = {}; 
    let first = true, min = {x: Infinity, y: Infinity}, max = {x: -Infinity, y: -Infinity};
    while (true) {
        let tile = `${x},${y}`, outputs = program.cpu(painted[tile]===undefined ? (first ? 1 : 0) : painted[tile].color); //default to 1 if first, 0 otherwise
        if (program.done()) break; 
        if (x>max.x) max.x=x; if (x<min.x) min.x=x; if (y>max.y) max.y=y; if (y<min.y) min.y = y;
        painted[tile] = {color: outputs[0], point: {x: x, y: y}}, [x, y, rotation] = rotate(x, y, rotation, outputs[1]), first = false;
    }

    console.log("Part 2:", draw(painted, min, max));
});

function rotate(x: number, y: number, rotation: number, command: number): [number, number, number] {
    let newr = (rotation + (command===0 ? 90 : -90)) % 360; if (newr<0) newr = 360+newr;
    if (newr===90) y--; else if (newr===180) x--; else if (newr===270) y++; else x++;
    return [x, y, newr];
}

function draw(painted: { [xy: string]: Tile }, min: Point, max: Point): string {
    let canvas: string[][] = Array(max.y-min.y+1).fill("").map(() => Array(max.x-min.x+1).fill(" "));
    Object.keys(painted).forEach(tile => canvas[painted[tile].point.y-min.y][painted[tile].point.x-min.x] = painted[tile].color===0 ? " " : "█");
    return canvas.map(line => `\n${line.join("")}`).join("");
}