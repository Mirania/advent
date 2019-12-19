import * as fs from 'fs';

type Point = { x: number, y: number };
type Path = { steps: number, doors: string, keys: string };
type Robot = { path: string, steps: number };

let grid: string[][];
let matrix: { [from: string]: { [to: string]: Path } };
let keys: { [key: string]: Point };
let result: {steps: number, state: Robot[]};

fs.readFile("src/18/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    grid = text.split("\n").map(line => line.split("")); 

    keys = getAllKeys(), matrix = makeMatrix(), result = collectKeys(1);
    console.log("Part 1:", result.steps); console.log(result.state);

    modifyGrid();
    keys = getAllKeys(), matrix = makeMatrix(), result = collectKeys(4);
    console.log("Part 2:", result.steps); console.log(result.state);
});

let getStarts = () => { let s: Point[] = []; grid.forEach((line,y) => line.forEach((char,x) => { if (char==="@") s.push({x: x, y: y}) })); return s; }
let getChar = (point: Point) => point.y<0 || point.x<0 ? "#" : grid[point.y][point.x];
let isKey = (char: string) => { let n = char.charCodeAt(0); return n>=97 && n<=122; }
let isDoor = (char: string) => { let n = char.charCodeAt(0); return n>=65 && n<=90; }
let isWall = (char: string) => { return char.charCodeAt(0)===35; }
let setify = (point: Point) => `${point.x},${point.y}`;
let makeID = (route: string) => route.length<=2 ? route : route[0]+route.slice(1,route.length-1).split("").sort().join("")+route[route.length-1];

function collectKeys(robots: number): {steps: number, state: Robot[]} {
    let states: Robot[][] = [[]];
    let keylist: string[][] = [];
    let ids: { [id: string]: number } = {};
    let min = Infinity, minstate: Robot[];
    let solutionsize = 0;

    for (let i=0; i<robots; i++) {
        states[0].push({path: i.toString(), steps: 0});
        keylist.push(Object.keys(matrix[i.toString()]));
        solutionsize += keylist[i].length+1;
    }

    while (states.length>0) {
        let state = states.pop();
        let metrics = state.reduce((prev,cur) => { return {size: prev.size+cur.path.length, steps: prev.steps+cur.steps} }, {size: 0, steps: 0});
        if (metrics.size===solutionsize && metrics.steps<min) { min = metrics.steps; minstate = state; continue; }
        state.forEach((_,i) => {
            keylist[i].forEach(key => {    
                if (state[i].path.includes(key)) return;

                let path = state[i].path;
                let latest = state[i].path[state[i].path.length-1];

                for (let i=0; i<matrix[latest][key].keys.length; i++) {
                    if (!path.includes(matrix[latest][key].keys[i])) path += matrix[latest][key].keys[i];
                }

                let id = state.reduce((prev,cur,idx) => prev + makeID(i===idx ? path : cur.path), "");
                let steps = state[i].steps+matrix[latest][key].steps;
                let totalsteps = state.reduce((prev,cur,idx) => prev + (i===idx ? steps : cur.steps), 0);

                if (totalsteps>=min || (ids[id]!==undefined && ids[id]<=totalsteps) || !canGetKey(state, matrix[latest][key].doors)) return;
                
                let newstate = state.slice(0);
                ids[id] = totalsteps;
                newstate[i] = {path: path, steps: steps};
                states.push(newstate);
            });
        })
        
    }
    return {steps: min, state: minstate};
}

function canGetKey(state: Robot[], doors: string): boolean {
    for (let i=0; i<doors.length; i++) {
        if (!state.some(robot => robot.path.includes(doors[i]))) return false;
    }
    return true;
}

function makeMatrix(): { [from: string]: { [to: string]: Path } } {
    let mat: { [from: string]: { [to: string]: Path } } = {};
    let keynames = Object.keys(keys);
    keynames.forEach(from => {
        mat[from] = {};
        keynames.forEach(to => {
            if (from===to) return;
            let path = pathfinder(keys[from], keys[to]);
            if (path.steps!==Infinity) mat[from][to] = path;
        })
    });
    getStarts().forEach((entrance,index) => {
        mat[index] = {};
        keynames.forEach(to => {   
            let path = pathfinder(entrance, keys[to]);
            if (path.steps!==Infinity) mat[index][to] = path; 
        });
    });
    return mat;
}

function getAllKeys(): { [key: string]: Point } {
    let k: { [key: string]: Point } = {};
    grid.forEach((line,y) => line.forEach((char,x) => { if (isKey(char)) k[char] = {x: x, y: y}; })); 
    return k;
}

function pathfinder(start: Point, finish: Point): Path {
    let nodes = [{steps: 0, point: start, doors: "", keys: ""}];
    let searched = new Set<string>().add(setify(start));

    while (true) {
        if (nodes.length===0) return {steps: Infinity, doors: null, keys: null};
        let n = nodes.shift();

        let char = getChar(n.point);
        if (isDoor(char)) n.doors += char.toLowerCase();
        if (isKey(char)) n.keys += char;
        if (n.point.x===finish.x && n.point.y===finish.y) return {steps: n.steps, doors: n.doors, keys: n.keys};    

        let u = {x: n.point.x, y: n.point.y-1}, d = {x: n.point.x, y: n.point.y+1}, 
            l = {x: n.point.x-1, y: n.point.y}, r = {x: n.point.x+1, y: n.point.y};

        if (!searched.has(setify(u)) && (!isWall(getChar(u))))
            { nodes.push({point: u, steps: n.steps+1, doors: n.doors, keys: n.keys}); searched.add(setify(u)); } //up
        if (!searched.has(setify(d)) && (!isWall(getChar(d)))) 
            { nodes.push({point: d, steps: n.steps+1, doors: n.doors, keys: n.keys}); searched.add(setify(d)); } //down
        if (!searched.has(setify(l)) && (!isWall(getChar(l)))) 
            { nodes.push({point: l, steps: n.steps+1, doors: n.doors, keys: n.keys}); searched.add(setify(l)); } //left
        if (!searched.has(setify(r)) && (!isWall(getChar(r)))) 
            { nodes.push({point: r, steps: n.steps+1, doors: n.doors, keys: n.keys}); searched.add(setify(r)); } //right
    }
}

function modifyGrid(): void {
    let p = getStarts()[0];
    grid[p.y-1][p.x-1] = "@"; grid[p.y-1][p.x] = "#"; grid[p.y-1][p.x+1] = "@";
      grid[p.y][p.x-1] = "#";   grid[p.y][p.x] = "#";   grid[p.y][p.x+1] = "#";
    grid[p.y+1][p.x-1] = "@"; grid[p.y+1][p.x] = "#"; grid[p.y+1][p.x+1] = "@";
}