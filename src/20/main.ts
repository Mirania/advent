import * as fs from 'fs';

type Point = { x: number, y: number };
type Maze = { portals: { [xyentry: string]: Portal }, start: Point, end: Point };
type Portal = { name: string, dest: Point, loc: Point, levelmod: number };

let grid: string[][];
let maze: Maze;

fs.readFile("src/20/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    grid = text.split("\n").map(line => line.split(""));

    maze = thinkWithPortals();
    console.log("Part 1:", pathfinder(maze, true));
    console.log("Part 2:", pathfinder(maze, false));

});

let getChar = (point: Point) => point.y<0 || point.x<0 || point.y>grid.length-1 || point.x>grid[0].length-1 ? "#" : grid[point.y][point.x];
let isPortal = (char: string) => { let n = char.charCodeAt(0); return n>=65 && n<=90; }
let isWall = (char: string) => char === "#";
let isDot = (char: string) => char === ".";
let keyify = (point: Point, level?: number) => `${point.x},${point.y},${level===undefined ? "" : level}`;

function nearbyPortal(point: Point): Point {
    let v = {x: point.x, y: point.y+1};
    let h = {x: point.x+1, y: point.y};
    return isPortal(getChar(v)) ? v : isPortal(getChar(h)) ? h : null;
}

function pathfinder(maze: Maze, ignoreLevels: boolean): number {
    let nodes = [{ steps: 0, point: maze.start, level: 0 }];
    let ids: { [x: string]: number } = {};

    while (true) {
        if (nodes.length === 0) return Infinity;
        let n = nodes.shift();

        let char = getChar(n.point);
        if (!isDot(char) && !isPortal(char)) continue;
        if ((n.level===0 || ignoreLevels) && n.point.x === maze.end.x && n.point.y === maze.end.y) return n.steps;

        let newsteps = n.steps+1;
        let dirs: Point[] = [{ x: n.point.x, y: n.point.y - 1 }, { x: n.point.x, y: n.point.y + 1 },
                             { x: n.point.x - 1, y: n.point.y }, { x: n.point.x + 1, y: n.point.y }];

        dirs.forEach(dir => {
            let portal = maze.portals[keyify(dir)], key = keyify(dir, n.level);
            if (ids[key]!==undefined && ids[key]<=newsteps) return;

            if (portal && (n.level+portal.levelmod>=0 || ignoreLevels)) {
                let newlevel = n.level + portal.levelmod;
                nodes.push({steps: newsteps, point: portal.dest, level: newlevel});
                ids[keyify(portal.dest, newlevel)] = newsteps;
            } else {
                nodes.push({steps: newsteps, point: dir, level: n.level});
            }

            ids[key] = newsteps; 
        });
    }
}

function thinkWithPortals(): Maze {
    let helper: { [portal: string]: {entry: Point, exit: Point} } = {}, maze: Maze = {portals: {}, start: null, end: null};
    let wallstart: Point, wallend: Point;

    grid.forEach((line,y) => line.forEach((ch1,x) => {
        let nearby = nearbyPortal({x: x, y: y}), entry: Point, exit: Point;
        if (isWall(ch1)) { if (!wallstart) wallstart = {x: x, y: y}; wallend = {x: x, y: y}; return; }
        if (!isPortal(ch1) || nearby===null) return;

        if (isDot(getChar({x: x-1, y: y}))) { entry = {x: x, y: y}; exit = {x: x-1, y: y}; }
        else if (isDot(getChar({x: x, y: y-1}))) { entry = {x: x, y: y}; exit = {x: x, y: y-1}; }
        else if (isDot(getChar({x: nearby.x+1, y: nearby.y}))) { entry = nearby; exit = {x: nearby.x+1, y: nearby.y}; }
        else { entry = nearby; exit = {x: nearby.x, y: nearby.y+1}; }

        let key = ch1+getChar(nearby); 
        if (helper[key]) {
            maze.portals[keyify(entry)] = {name: key, dest: helper[key].exit, loc: entry, levelmod: null};
            maze.portals[keyify(helper[key].entry)] = {name: key, dest: exit, loc: helper[key].entry, levelmod: null};
        } else helper[key] = {entry: entry, exit: exit};
    }));

    for (let portal in maze.portals) {
        let loc = maze.portals[portal].loc;
        maze.portals[portal].levelmod = (loc.x<wallstart.x || loc.x>wallend.x || loc.y<wallstart.y || loc.y>wallend.y) ? -1 : 1;
    }

    maze.start = helper["AA"].exit; maze.end = helper["ZZ"].exit;
    grid[helper["AA"].entry.y][helper["AA"].entry.x] = "#";
    grid[helper["ZZ"].entry.y][helper["ZZ"].entry.x] = "#";
    return maze;
}