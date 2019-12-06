import * as fs from 'fs';

fs.readFile("src/6/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }
 
    //{B: COM} = B orbits COM
    let map: { [name: string]: string } = {};
    text.split("\n").map(orbit => orbit.split(")")).forEach(args => map[args[1]] = args[0]);

    console.log("Part 1:",totalTransfers(map));
    console.log("Part 2:",yourTransfers(map));
});

function totalTransfers(map: { [name: string]: string }): number {
    return Object.keys(map).reduce((count: number, orbit: string) => {
        while (map[orbit]) { count++; orbit = map[orbit]};
        return count;
    }, 0);
}

//calculate orbital sequences of YOU and SAN at the same time time, step by step.
//stop once the sequences have an orbit X in common.
//return the total steps of the path YOU->X->SAN.
function yourTransfers(map: { [name: string]: string}): number {
    let start = map["YOU"], end = map["SAN"];
    let youmap: { [name: string]: number } = {}; youmap[start] = 0;
    let endmap: { [name: string]: number } = {}; endmap[end] = 0;
    let common: string;

    while (map[start] || map[end]) { 
        if (map[start]) {
            youmap[map[start]] = youmap[start]+1; start = map[start];
            if (endmap[start]) { common = start; break;}
        }
        if (map[end]) {
            endmap[map[end]] = endmap[end]+1; end = map[end];
            if (youmap[end]) { common = end; break;}
        }
    }

    return common ? youmap[common]+endmap[common] : Infinity;
}