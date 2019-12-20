import * as fs from 'fs';

type Point = { x: number, y: number };
type Maze = { portals: { [xyentry: string]: {dest: Point, noreturn: Point} }, start: Point, end: Point };

let grid: string[][];
let maze: Maze;

fs.readFile("src/20/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    grid = text.split("\n").map(line => line.split(""));
    console.log(pathfinder(port()))

    //do i need noreturn on portals for anything?
    //add levelmod (-1/+1) depending on outer or iner
});

let getChar = (x: number, y: number) => y<0 || x<0 || y>grid.length-1 || x>grid[0].length-1 ? "#" : grid[y][x];
let isPortal = (char: string) => { let n = char.charCodeAt(0); return n>=65 && n<=90; }
let nearbyPortal = (x: number, y: number) => isPortal(getChar(x,y+1)) ? {x: x, y: y+1} : isPortal(getChar(x+1,y)) ? {x: x+1, y: y} : null;
let isDot = (char: string) => char===".";
let setify = (point: Point) => `${point.x},${point.y}`;

function pathfinder(maze: Maze): number {
    let nodes = [{steps: 0, point: maze.start}];
    let searched = new Set<string>().add(setify(maze.start));

    while (true) {
        if (nodes.length===0) return Infinity;
        let n = nodes.shift();

        let char = getChar(n.point.x, n.point.y);
        if (!isDot(char) && !isPortal(char)) continue;
        if (n.point.x===maze.end.x && n.point.y===maze.end.y) return n.steps;   

        let u = {x: n.point.x, y: n.point.y-1}, d = {x: n.point.x, y: n.point.y+1}, 
            l = {x: n.point.x-1, y: n.point.y}, r = {x: n.point.x+1, y: n.point.y};
        let ukey = setify(u), dkey = setify(d), lkey = setify(l), rkey = setify(r);

        if (!searched.has(ukey)) {
            if (maze.portals[ukey]) {
                nodes.push({steps: n.steps+1, point: maze.portals[ukey].dest});
                searched.add(ukey); searched.add(setify(maze.portals[ukey].dest));
            } else { nodes.push({steps: n.steps+1, point: u}); searched.add(ukey); }
        }
        if (!searched.has(dkey)) {
            if (maze.portals[dkey]) {
                nodes.push({steps: n.steps+1, point: maze.portals[dkey].dest});
                searched.add(dkey); searched.add(setify(maze.portals[dkey].dest));
            } else { nodes.push({steps: n.steps+1, point: d}); searched.add(dkey); }
        }
        if (!searched.has(lkey)) {
            if (maze.portals[lkey]) {
                nodes.push({steps: n.steps+1, point: maze.portals[lkey].dest});
                searched.add(lkey); searched.add(setify(maze.portals[lkey].dest));
            } else { nodes.push({steps: n.steps+1, point: l}); searched.add(lkey); }
        }
        if (!searched.has(rkey)) {
            if (maze.portals[rkey]) {
                nodes.push({steps: n.steps+1, point: maze.portals[rkey].dest});
                searched.add(rkey); searched.add(setify(maze.portals[rkey].dest));
            } else { nodes.push({steps: n.steps+1, point: r}); searched.add(rkey); }
        }
    }
}

function port(): Maze {
    let helper: { [portal: string]: {entry: Point, exit: Point} } = {}, maze: Maze = {portals: {}, start: null, end: null};

    grid.forEach((line,y) => line.forEach((ch1,x) => {
        let nearby = nearbyPortal(x,y), entry: Point, exit: Point;
        if (!isPortal(ch1) || nearby===null) return;

        if (isDot(getChar(x-1,y))) { entry = {x: x, y: y}; exit = {x: x-1, y: y}; }
        else if (isDot(getChar(x,y-1))) { entry = {x: x, y: y}; exit = {x: x, y: y-1}; }
        else if (isDot(getChar(nearby.x+1,nearby.y))) { entry = nearby; exit = {x: nearby.x+1, y: nearby.y}; }
        else { entry = nearby; exit = {x: nearby.x, y: nearby.y+1}; }

        let key = ch1+getChar(nearby.x,nearby.y); 
        if (helper[key]) {
            maze.portals[setify(entry)] = {dest: helper[key].exit, noreturn: helper[key].entry};
            maze.portals[setify(helper[key].entry)] = {dest: exit, noreturn: entry};
        } else helper[key] = {entry: entry, exit: exit};
    }));

    maze.start = helper["AA"].exit; maze.end = helper["ZZ"].exit;
    grid[helper["AA"].entry.y][helper["AA"].entry.x] = "#";
    grid[helper["ZZ"].entry.y][helper["ZZ"].entry.x] = "#";
    return maze;
}