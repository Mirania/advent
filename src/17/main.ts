import * as fs from 'fs';
import * as program from './intcode';

type Point = { x: number, y: number };

fs.readFile("src/17/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    let originalcode = text.split(",").map(value => parseInt(value));

    program.init(originalcode);
    console.log("Part 1:", intersect(map()));

    program.init(originalcode);
    let traversed = traverse();
    console.log("Part 2:", traversed.dust);

    printGrid(traversed.grid);
});

let skipToNextInput = () => { while (!program.waiting()) program.cpu(); };
let printGrid = (grid: string[][]) => console.log(grid.map(line => line.join("")).join("\n"));

function traverse(): { dust: number, grid: string[][] } {
    program.memset(0x0, 2); skipToNextInput();
    program.cpu("C,C,A,B,A,B,A,B,A,C\n"); skipToNextInput();
    program.cpu("L,12,R,6,L,8,L,12\n"); skipToNextInput();
    program.cpu("R,12,L,10,L,10\n"); skipToNextInput();
    program.cpu("R,6,L,12,R,6\n"); skipToNextInput();
    program.cpu("n\n");

    let grid = map(), lastOutput = program.cpu();

    return {dust: lastOutput, grid: grid};
}

function map(): string[][] {
    let grid: string[][] = [], line: string[] = [];

    while (!program.done()) {
        let out = program.cpu(); if (program.done() || (out===10 && line.length===0)) break;
        if (out===10 && line.length>0) { grid.push(line); line = []; }
        else line.push(String.fromCharCode(out));
    }

    return grid;
}

function intersect(grid: string[][]): number {
    let list: Point[] = [];

    grid.forEach((line,y) => line.forEach((char,x) => {
        if (char!=="#") return; let nearby = 0;

        if (x>0 && grid[y][x-1]==="#") nearby++;
        if (x<grid[0].length-1 && grid[y][x+1]==="#") nearby++;
        if (y>0 && grid[y-1][x]==="#") nearby++;
        if (y<grid.length-1 && grid[y+1][x]==="#") nearby++;

        if (nearby>=3) list.push({x: x, y: y});
    }));
    
    return list.reduce((prev,cur) => prev + cur.x * cur.y, 0);
}