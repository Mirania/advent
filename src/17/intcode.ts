let intcode: number[];
let relativebase: number, pointerlimit: number, i: number, halted: boolean, waitinput: boolean;

export type ProgramState = { base: number, code: number[], limit: number, ptr: number, halted: boolean, waiting: boolean };

export function init(code: number[]): void {
    intcode = code.slice(0);
    relativebase = 0, pointerlimit = intcode.length, i = 0, halted = false, waitinput = false;
}

export function memset(address: number, value: number): void {
    intcode[address] = value;
}

export function stateset(state: ProgramState): void {
    relativebase = state.base; 
    intcode = state.code.slice(0); 
    pointerlimit = state.limit; 
    i = state.ptr; 
    halted = state.halted;
    waitinput = state.waiting;
}

export function state(): ProgramState {
    return {base: relativebase, code: intcode, limit: pointerlimit, ptr: i, halted: halted, waiting: waitinput};
}

export function waiting(): boolean {
    return waitinput;
}

export function done(): boolean {
    return halted;
}

export function cpu(input?: string): number {
    if (input!==undefined && input.length>20) throw new Error("input too large");
    let buffer: number[] = input===undefined ? [] : input.split("").map(c => c.charCodeAt(0));

    while (i < pointerlimit) {     
        switch (intcode[i] % 100) { //last 1 or 2 digits of instruction
            case 1: intcode[write(i, 3)] = read(i, 1) + read(i, 2); i += 4; break;
            case 2: intcode[write(i, 3)] = read(i, 1) * read(i, 2); i += 4; break;
            case 3: if (buffer.length==0) { waitinput = true; return; }
                    else { waitinput = false; intcode[write(i, 1)] = buffer.shift(); i += 2; break; }
            case 4: i += 2; return read(i-2, 1);
            case 5: i = read(i, 1) !== 0 ? read(i, 2) : i + 3; break;
            case 6: i = read(i, 1) ===   0 ? read(i, 2) : i + 3; break;
            case 7: intcode[write(i, 3)] = read(i, 1) < read(i, 2) ? 1 : 0; i += 4; break;
            case 8: intcode[write(i, 3)] = read(i, 1) === read(i, 2) ? 1 : 0; i += 4; break;
            case 9: relativebase += read(i, 1); i += 2; break;
            case 99: halted = true; return;
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