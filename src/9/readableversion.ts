import * as fs from 'fs';

let originalcode: number[], intcode: number[];
let relativebase: number, pointerlimit: number;

fs.readFile("src/9/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    originalcode = text.split(",").map((value) => parseInt(value));

    console.log("Part 1:"), cpu(1);
    console.log("Part 2:"), cpu(2);
});

function cpu(input: number): void {
    relativebase = 0, intcode = originalcode.slice(0), pointerlimit = intcode.length;

    for (let i = 0; i < pointerlimit;) {     
        switch (intcode[i] % 100) { //last 1 or 2 digits of instruction
            case 1: intcode[write(i, 3)] = read(i, 1) + read(i, 2); i += 4; break;
            case 2: intcode[write(i, 3)] = read(i, 1) * read(i, 2); i += 4; break;
            case 3: intcode[write(i, 1)] = input; i += 2; break;
            case 4: console.log(read(i, 1)); i += 2; break;
            case 5: i = read(i, 1) !== 0 ? read(i, 2) : i + 3; break;
            case 6: i = read(i, 1) === 0 ? read(i, 2) : i + 3; break;
            case 7: intcode[write(i, 3)] = read(i, 1) < read(i, 2) ? 1 : 0; i += 4; break;
            case 8: intcode[write(i, 3)] = read(i, 1) === read(i, 2) ? 1 : 0; i += 4; break;
            case 9: relativebase += read(i, 1); i += 2; break;
            case 99: return;
        }
    }
}

//just helper functions
let read = (pointer: number, argposition: number) => resolve(pointer, argposition, false);
let write = (pointer: number, argposition: number) => resolve(pointer, argposition, true);

//convert pointer to value (write=false) or array position (write=true)
function resolve(pointer: number, argposition: number, write: boolean): number {
    let instruction = intcode[pointer].toString(), mode = instruction[instruction.length-2-argposition], index: number;   

    if (mode==="2") index = relativebase+intcode[pointer+argposition];    //relative = base + immediate
    else if (mode ==="1" && !write) index = pointer+argposition;          //immediate
    else index = intcode[pointer+argposition];                            //position (default mode)

    if (index<0) throw new Error("negative address "+index); if (!intcode[index]) intcode[index] = 0; 
    return write ? index : intcode[index];
}