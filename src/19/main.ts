import * as fs from 'fs';
import * as program from './intcode';

type Beam = { startx: number, endx: number, y: number, length: number };

let intcode: number[];
let origin: Beam = {startx: 0, endx: 0, y: 0, length: 1};

fs.readFile("src/19/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    intcode = text.split(",").map(value => parseInt(value));
    
    console.log("Part 1:", count(49));
    console.log("Part 2:", findSquare(100, 55));

});

function getNextBeam(lastBeam: Beam, maxDelta: number): Beam {
    let startxEstimate = lastBeam.startx, endxEstimate = lastBeam.endx, startx = -1, endx = -1;
    for (let x=startxEstimate;x<=endxEstimate+maxDelta;x++) {
        program.init(intcode);
        if (program.cpu(x,lastBeam.y+1)) { //beam found
            if (startx===-1) { startx = x; x += Math.max(0, endxEstimate+1-startxEstimate-maxDelta); } //skip to likely endx
        } else if (startx!==-1) endx = x-1; //beam not found
        if (startx!==-1 && endx!==-1)
            return {startx: startx, endx: endx, y: lastBeam.y+1, length: endx-startx+1};
    }
    //assume empty line, keep meta info
    return {startx: lastBeam.startx, endx: lastBeam.endx, y: lastBeam.y+1, length: 0};
}

function findSquare(size: number, startDelta: number): number {
    let beam = origin;
    while (true) {
        beam = getNextBeam(beam, 3);
        if (beam.length<=startDelta+size) continue;
        for (let x=beam.startx+startDelta;x<=beam.endx;x++) {
            program.init(intcode);
            if (program.cpu(x,beam.y+99) && beam.endx-x>=99) return x*10000+beam.y;
        }  
    }
}

function count(ylimit: number): number {
    let beam = origin, counter = 1;
    while (beam.y<ylimit) {
        beam = getNextBeam(beam, 3);
        counter += beam.length;
    }
    return counter;
}