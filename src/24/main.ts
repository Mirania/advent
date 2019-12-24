import * as fs from 'fs';

let grid: string[][]; //part 1
let grids: { [level: number]: string[][] } = {}, maxlevel = 0; //part 2

fs.readFile("src/24/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    grid = text.split("\n").map(line => line.split(""));
    grids[0] = grid.map(line => line.map(char => char));

    console.log("Part 1:", duplicateBio());
    console.log("Part 2:", countBugs());
});

let isBug = (x: number, y: number) => x>=0 && y>=0 && x<=grid.length-1 && y<=grid.length-1 && grid[y][x]==="#";
let isBugRecursive = (x: number, y: number, level: number) => grids[level] && grids[level][y][x]==="#";
let bugsInRow = (y: number, level: number) => grids[level] ? grids[level][y].reduce((p, c) => p + (c==="#" ? 1 : 0), 0) : 0;
let bugsInCol = (x: number, level: number) => grids[level] ? grids[level].reduce((p, c) => p + (c[x]==="#" ? 1 : 0), 0) : 0;
let newGrid = () => Array.from<any, string[]>({length: 5}, () => Array(5).fill("."));

// part 1 -------------------------------------------------------------------------------------------

function duplicateBio(): number {
    let states = new Set<string>();
    let state: string;
    while (true) { 
        state = grid.reduce((prevline,curline,y) => prevline +
            curline.reduce((prev,cur,x) => cur==="#" ? prev + `/${x},${y}` : prev, ""), "");
        if (states.has(state)) break; states.add(state); tick(); 
    }
    return grid.reduce((prevline,curline,y) => prevline +
        curline.reduce((prev,cur,x) => cur==="#" ? prev + Math.pow(2,5*y+x) : prev, 0), 0);
}

function tick(): void {
    let changes: {x: number, y: number, life: boolean}[] = [];

    grid.forEach((line,y) => line.forEach((char,x) => {
        let adj = adjacent(x,y);
        if (char==="#" && adj!==1) changes.push({x: x, y: y, life: false});
        else if (char==="." && (adj===1 || adj===2)) changes.push({x: x, y: y, life: true});
    }));
    changes.forEach(change => grid[change.y][change.x] = change.life ? "#" : ".");
}

function adjacent(x: number, y: number): number {
    let count = 0;
    if (isBug(x, y-1)) count++;
    if (isBug(x-1, y)) count++;
    if (isBug(x+1, y)) count++;
    if (isBug(x, y+1)) count++;
    return count;
}

// part 2 -------------------------------------------------------------------------------------------

function countBugs(): number {
    for (let i=0; i<200; i++) tickRecursive();
    let count = 0;
    for (let level = -maxlevel; level <= maxlevel; level++) {
        count += grids[level].reduce((prevline,curline) => prevline +
            curline.reduce((prev,cur) => cur==="#" ? prev + 1 : prev, 0), 0);
    }
    return count;
}

function tickRecursive(): void {
    let changes: {x: number, y: number, level: number, life: boolean}[] = [];
    maxlevel++; grids[-maxlevel] = newGrid(); grids[maxlevel] = newGrid();

    for (let level=-maxlevel; level<=maxlevel; level++) {
        grids[level].forEach((line,y) => line.forEach((char,x) => {
            if (x===2 && y===2) return;
            let adj = adjacentRecursive(x, y, level);
            if (char==="#" && adj!==1) changes.push({x: x, y: y, level: level, life: false});
            else if (char==="." && (adj===1 || adj===2)) changes.push({x: x, y: y, level: level, life: true});
        }));
    }
    changes.forEach(change => grids[change.level][change.y][change.x] = change.life ? "#" : ".");
}

function adjacentRecursive(x: number, y: number, level: number): number {
    let count = 0;

    //up
    if (y===0 && isBugRecursive(2, 1, level-1)) count++;
    else if (x===2 && y===3) count += bugsInRow(4, level+1);
    else if (y>0 && isBugRecursive(x, y-1, level)) count++;
    if (count>=3) return count;
    //down
    if (y===4 && isBugRecursive(2, 3, level-1)) count++;
    else if (x===2 && y===1) count += bugsInRow(0, level+1);
    else if (y<4 && isBugRecursive(x, y+1, level)) count++;
    if (count>=3) return count;
    //left
    if (x===0 && isBugRecursive(1, 2, level-1)) count++;
    else if (x===3 && y===2) count += bugsInCol(4, level+1);
    else if (x>0 && isBugRecursive(x-1, y, level)) count++;
    if (count>=3) return count;
    //right
    if (x===4 && isBugRecursive(3, 2, level-1)) count++;
    else if (x===1 && y===2) count += bugsInCol(0, level+1);
    else if (x<4 && isBugRecursive(x+1, y, level)) count++;
    return count;
}