import * as fs from 'fs';
import * as program from './intcode';

type Tile = { color: number, point?: Point };
type Point = { x: number, y: number };

fs.readFile("src/13/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    let originalcode = text.split(",").map((value) => parseInt(value));
    
    program.init(originalcode); let tiles = {};
    let counter = 0;
    while (true) {
       let outputs = program.cpu(); if (program.done()) break; 
       if (outputs[2]===2) counter++;
    }

    console.log(counter);

});

function draw(painted: { [xy: string]: Tile }, min: Point, max: Point): string {
    let canvas: string[][] = Array(max.y-min.y+1).fill("").map(() => Array(max.x-min.x+1).fill(" "));
    Object.keys(painted).forEach(tile => canvas[painted[tile].point.y-min.y][painted[tile].point.x-min.x] = painted[tile].color===0 ? " " : "█");
    return canvas.map(line => `\n${line.join("")}`).join("");
}