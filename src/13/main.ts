import * as fs from 'fs';
import * as program from './intcode';

type Point = { x: number, y: number };

fs.readFile("src/13/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    let intcode = text.split(",").map((value) => parseInt(value));

    let metrics = stats(intcode);
    console.log("Part 1:", metrics.blocks);
    console.log("Part 2:", game(intcode, metrics.max, true));
});

function stats(intcode: number[]): { blocks: number, max: Point } {
    program.init(intcode);
    let counter = 0, max = {x: -Infinity, y: -Infinity}, x: number, y: number, type: number;
    while (true) { 
        [x, y, type] = program.cpu(); if (program.done()) return {blocks: counter, max: max}; 
        if (x > max.x) max.x = x; if (y > max.y) max.y = y; if (type === 2) counter++;   
    }
}

function game(intcode: number[], max: Point, headless: boolean): number {
    program.init(intcode); program.memset(0x0, 2);
    let board: string[][] = Array(max.y+1).fill("").map(() => Array(max.x+1).fill(" ")), input = 0, score = 0, ball: Point, pad: Point;
    while (true) { 
        let output = program.cpu(input); if (program.done()) return score;
        if (output[2]===4) ball = {x: output[0], y: output[1]}; if (output[2]===3) pad = {x: output[0], y: output[1]}; if (output[0]===-1) score = output[2];
        if (ball && pad) input = ball.x<pad.x ? -1 : ball.x>pad.x ? 1 : 0; //insane neural network
        if (!headless) draw(board, output); 
    }
}

function draw(board: string[][], tile: [number, number, number]): void {
    let empty = " ", wall = "█", block = "◻", paddle = "▬", ball = "●";
    board[tile[1]][tile[0]] = tile[2]===0 ? empty : tile[2]===1 ? wall : tile[2]===2 ? block : tile[2]===3 ? paddle : ball;
    console.log(board.map(line => `\n${line.join("")}`).join(""));
}