import * as fs from 'fs';

fs.readFile("src/10/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    let map: string[][] = text.split("\n").map(line => line.split(""));

    let asteroids: {x: number, y: number}[] = []; 
    map.forEach((line,y) => line.forEach((char,x) => { if (char==="#") asteroids.push({x: x, y: y}) }));

    let positions: { [asteroid: string]: Set<String> } = {};
    asteroids.forEach(ast => positions[`${ast.x},${ast.y}`] = detect(asteroids, ast.x, ast.y));

    console.log("Part 1: ",Math.max(...Object.keys(positions).map(ast => positions[ast].size))); //11,11

});

//returns both the slope of a line between two points and its direction (+ or -)
//direction: (+) = [270º, 90º]. (-) = ]90º, 270º[
function sight(centerX: number, centerY: number, outerX: number, outerY: number): string {
    return outerX<centerX ? `(-)${(outerY-centerY)/(outerX-centerX)}` : `(+)${(outerY-centerY)/(outerX-centerX)}`;
}

function detect(asteroids: {x: number, y: number}[], x: number, y: number): Set<String> {
    let detected = new Set<String>();
    asteroids.forEach(other => { if (other.x != x || other.y != y) detected.add(sight(x, y, other.x, other.y)) });
    return detected;
}

//starts at (+)-Infinity    