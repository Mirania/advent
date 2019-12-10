import * as fs from 'fs';

type Point = { x: number, y: number };
type SightingSet = { [sight: string]: Point };
type SightingArray = { sight: string, point: Point }[];

fs.readFile("src/10/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    let map: string[][] = text.split("\n").map(line => line.split(""));

    let asteroids: Point[] = []; 
    map.forEach((line,y) => line.forEach((char,x) => { if (char==="#") asteroids.push({x: x, y: y}) }));

    let locations: { [asteroid: string]: SightingSet } = {};
    asteroids.forEach(ast => locations[`${ast.x},${ast.y}`] = detect(asteroids, {x: ast.x, y: ast.y}));

    console.log("Part 1:",Math.max(...Object.keys(locations).map(ast => Object.keys(locations[ast]).length)));

    let bet = laser(locations["11,11"])[199]; //the station was placed at (11,11)
    console.log("Part 2:", bet.point.x * 100 + bet.point.y);

});

//returns both the slope of a line between two points and its direction (+ or -)
//direction: (+) = [270º, 90º]. (-) = ]90º, 270º[
function sight(center: Point, outer: Point): string {
    return outer.x<center.x ? `(-)${(outer.y-center.y)/(outer.x-center.x)}` : `(+)${(outer.y-center.y)/(outer.x-center.x)}`;
}

function detect(asteroids: Point[], self: Point): SightingSet {
    let detected: SightingSet = {};
    asteroids.forEach(other => { if (other.x != self.x || other.y != self.y) {
        let val = sight(self, other);
        if (!detected[val] || (manhattan(detected[val], self) > manhattan(other, self)))
            detected[val] = other; //break ties with manhattan distance
    }});
    return detected;
}

function manhattan(p1: Point, p2: Point): number {
    return Math.abs(p1.x-p2.x) + Math.abs(p1.y-p2.y);
}

//laser starts at (+)-Infinity (270º) and rotates 270º -> 0 º-> 90 -> 180º - 270º   
//first all (+) values in increasing order and then all (-) values in increasing order
function laser(location: SightingSet): SightingArray {
    let array = Object.keys(location).map(key => {return {sight: key, point: location[key]}});
    return array.sort((a,b) => {
        let afirst = a.sight[1]==="+", bfirst = b.sight[1]==="+";
        return afirst===bfirst ? parseFloat(a.sight.slice(3))-parseFloat(b.sight.slice(3)) : !afirst ? 1 : -1;
    });
}