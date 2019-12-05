import * as fs from 'fs';

let originalcode: number[];
let intcode: number[];

fs.readFile("src/5/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }
 
    originalcode = text.split(",").map((value) => parseInt(value));

    console.log("Part 1:"), cpu(1);
    console.log("Part 2:"), cpu(5);
});

function cpu(input: number): void {
    intcode = originalcode.slice(0); //make a copy

    for (let i=0; i<intcode.length;) {
        switch (intcode[i] % 100) { //last 1 or 2 digits of instruction
            case 1: intcode[intcode[i+3]] = resolve(i,1) + resolve(i,2); i+=4; break;    
            case 2: intcode[intcode[i+3]] = resolve(i,1) * resolve(i,2); i+=4; break;
            case 3: intcode[intcode[i+1]] = input; i+=2; break;
            case 4: console.log(resolve(i, 1)); i+=2; break;
            case 5: i = resolve(i,1)!==0 ? resolve(i,2) : i+3; break;
            case 6: i = resolve(i,1)===0 ? resolve(i,2) : i+3; break;
            case 7: intcode[intcode[i+3]] = resolve(i,1) < resolve(i,2) ? 1 : 0; i+=4; break;
            case 8: intcode[intcode[i+3]] = resolve(i,1) === resolve(i,2) ? 1 : 0; i+=4; break;
            case 99: return;
        }
    }
}

//if mode is set (=instruction[modeindex] exists) and is 1, return argument, else return intcode[argument]
function resolve(pointer: number, argposition: number): number {
    let instruction = intcode[pointer].toString();
    return instruction[instruction.length-2-argposition]==="1" ? intcode[pointer+argposition] : intcode[intcode[pointer+argposition]];
}