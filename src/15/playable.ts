import * as fs from 'fs';
import * as keypress from 'keypress';
import * as program from './intcode';

type Point = { x: number, y: number };

let memory: string[][], max: Point = {x: 41, y: 41}, robot: Point = {x: 21, y: 21};

fs.readFile("src/15/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    let intcode = text.split(",").map((value) => parseInt(value));

    game(intcode);
});

function move(input: 1|2|3|4): boolean {
    let output = program.cpu(input), newpos: Point, offset: Point = {x: 0, y: 0};
    switch (input) { //get relevant position
        case 1: newpos = {x: robot.x, y: robot.y-1}; if (newpos.y<0) offset.y = -1; break;
        case 2: newpos = {x: robot.x, y: robot.y+1}; if (newpos.y>max.y) {max.y = newpos.y; offset.y = 1;} break;
        case 3: newpos = {x: robot.x-1, y: robot.y}; if (newpos.x<0) offset.x = -1; break;
        case 4: newpos = {x: robot.x+1, y: robot.y}; if (newpos.x>max.x) {max.x = newpos.x; offset.x = 1;} break;
    }
    if (newpos.x > max.x) max.x = newpos.x; if (newpos.y > max.y) max.y = newpos.y; //update boundaries
    memory[robot.y][robot.x] = " "; //clear last position
    resizeMemory(offset); // increase grid size
    switch (output) {
        case 0: memory[Math.max(newpos.y,0)][Math.max(newpos.x,0)] = "█"; robot = {x: robot.x-Math.min(offset.x,0), y: robot.y-Math.min(offset.y,0)};
                memory[robot.y][robot.x] = "X"; break; //wall
        case 1: robot = {x: Math.max(newpos.x,0), y: Math.max(newpos.y,0)}; memory[robot.y][robot.x] = "X"; break; //moved
        case 2: robot = {x: Math.max(newpos.x,0), y: Math.max(newpos.y,0)}; memory[robot.y][robot.x] = "O"; return true; //oxygen system
    }
    draw();
    return false;
}

function game(intcode: number[]): void {
    program.init(intcode);
    memory = Array(max.y+1).fill("").map(() => Array(max.x+1).fill(" "));
    memory[robot.y][robot.x] = "X";
    draw();
    keyListener();
}

function resizeMemory(offset: Point): void {
    if (offset.x===1) memory = memory.map(line => line.concat([" "]));
    if (offset.x===-1) memory = memory.map(line => [" "].concat(line));
    if (offset.y===1) memory.push(Array(max.x+1).fill(" "));
    if (offset.y===-1) memory.unshift(Array(max.x+1).fill(" "));
}

function draw(): void {
    let border = "?".repeat(memory[0].length + 2);
    console.log(border+memory.map(line => `\n?${line.join("")}?`).join("")+"\n"+border);
}

function keyListener(): void {
    keypress(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();

    process.stdin.on('keypress', function (_, key) {
        let i: 1|2|3|4;
        if (key.ctrl && key.name==="c") process.stdin.pause();
        if (key.name==="up") i = 1;
        if (key.name==="down") i = 2;
        if (key.name==="left") i = 3;
        if (key.name==="right") i = 4;

        if (move(i)) console.log("Oxygen found!");
    });
}