import * as fs from 'fs';

type Point = { x: number, y: number, z: number };
type Moon = { pos: Point, vel: Point };

fs.readFile("src/12/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    let moons: Moon[] = text.replace(/[<xyz=,>]/g, "").split("\n").map(line => {
        let point = line.split(" ").map(value => parseInt(value));
        return { pos: {x: point[0], y: point[1], z: point[2]}, vel: {x: 0, y: 0, z: 0} };
    });

    console.log("Part 1:", timeSteps(moons,1000).energy);
    console.log("Part 2:", darkMagic(moons));
    
});

function timeSteps(moons: Moon[], steps: number): {moons: Moon[], energy: number} {
    for (let i=0; i<steps; i++) { applyGravity(moons); applyVelocity(moons); }
    return {moons: moons, energy: energy(moons)};
}

function applyGravity(input: Moon[]): void {
    input.forEach(moon => {
        moon.vel.x += input.reduce((prev,cur) => moon.pos.x>cur.pos.x ? prev-1 : moon.pos.x<cur.pos.x ? prev+1 : prev, 0);
        moon.vel.y += input.reduce((prev,cur) => moon.pos.y>cur.pos.y ? prev-1 : moon.pos.y<cur.pos.y ? prev+1 : prev, 0);
        moon.vel.z += input.reduce((prev,cur) => moon.pos.z>cur.pos.z ? prev-1 : moon.pos.z<cur.pos.z ? prev+1 : prev, 0);
    });
}

function applyVelocity(input: Moon[]): void {
    input.forEach(moon => { moon.pos.x += moon.vel.x; moon.pos.y += moon.vel.y; moon.pos.z += moon.vel.z; });
}

function energy(input: Moon[]): number {
    return input.reduce((prev,cur) => prev + (Math.abs(cur.pos.x)+Math.abs(cur.pos.y)+Math.abs(cur.pos.z)) *
                                             (Math.abs(cur.vel.x)+Math.abs(cur.vel.y)+Math.abs(cur.vel.z)), 0);
}

function darkMagic(input: Moon[]): number {
    let stored = {x: new Set<string>(), y: new Set<string>(), z: new Set<string>()}, counter = 0;
    let state = {moons: input, energy: 0}, periods = {x: 0, y: 0, z: 0}, axes = ["x","y","z"];
    let snapshot = (axis: string) => state.moons.map(moon => `${moon.pos[axis]}/${+moon.vel[axis]}`).join("/");
    let lcm = (a: number, b: number) => a*b/gcd(a,b), gcd = (a: number, b: number) => b===0 ? a : gcd(b,a%b);

    while (true) {
        axes.forEach(axis => {if (stored[axis].has(snapshot(axis)) && periods[axis]===0) periods[axis] = counter});
        if (axes.every(axis => periods[axis]!==0)) break;
        axes.forEach(axis => stored[axis].add(snapshot(axis)));
        state = timeSteps(state.moons, 1); counter++;
    }

    return lcm(periods.x, lcm(periods.y, periods.z));
}