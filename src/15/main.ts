import * as fs from 'fs';
import * as program from './intcode';

type Node = { x: number, y: number, state: program.ProgramState, dirs: number[] };

fs.readFile("src/15/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    let intcode = text.split(",").map((value) => parseInt(value));

    let path = search(intcode, "find") as number[];
    console.log("Part 1:", path.length);
    console.log("Part 2:", search(intcode, "fill", path));
});

let keyify = (x: number, y: number) => `${x},${y}`;

function search(intcode: number[], mode: "find" | "fill", path?: number[]): number[] | number {  
    program.init(intcode);
    if (mode === "fill") { for (let dir of path) program.cpu(dir); } //get to oxygen location
    let nodes: Node[] = [{x: 0, y: 0, state: program.state(), dirs: []}];
    let searched = new Set<string>().add("0,0");
    let maxdist = 0;

    while (true) {
        if (nodes.length===0) return mode === "find" ? undefined : maxdist;
        let n = nodes.shift();

        if (n.dirs.length!==0) {
            program.stateset(n.state);
            let out = program.cpu(n.dirs[n.dirs.length-1]);
            if (mode==="find" && out===2) return n.dirs;
            if (out===0) continue;
            n.state = program.state();      
        }

        maxdist = Math.max(maxdist, n.dirs.length);
        let u = keyify(n.x, n.y-1), d = keyify(n.x, n.y+1), l = keyify(n.x-1, n.y), r = keyify(n.x+1, n.y);
        
        //add unique neighbours
        if (!searched.has(u)) { nodes.push({x: n.x, y: n.y-1, state: n.state, dirs: n.dirs.concat([1])}); searched.add(u); } //up
        if (!searched.has(d)) { nodes.push({x: n.x, y: n.y+1, state: n.state, dirs: n.dirs.concat([2])}); searched.add(d); } //down
        if (!searched.has(l)) { nodes.push({x: n.x-1, y: n.y, state: n.state, dirs: n.dirs.concat([3])}); searched.add(l); } //left
        if (!searched.has(r)) { nodes.push({x: n.x+1, y: n.y, state: n.state, dirs: n.dirs.concat([4])}); searched.add(r); } //right
    }
}