let intcode: number[];
let relativebase: number, pointerlimit: number, i: number, halted: boolean, waitinput: boolean;
let buffer: number[], packet: {addr: number, x: number, y: number}, packetready: boolean;

export type ProgramState = { base: number, code: number[], limit: number, ptr: number, 
                             halted: boolean, waiting: boolean, buffer: number[],
                             packet: { addr: number, x: number, y: number }, packetready: boolean };

export function init(code: number[]): void {
    intcode = code.slice(0);
    relativebase = 0, pointerlimit = intcode.length, i = 0, halted = false, waitinput = false; 
    buffer = [], packet = {addr: null, x: null, y: null}, packetready = false;
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
    buffer = state.buffer.slice(0);
    packet = state.packet;
    packetready = state.packetready;
}

export function state(): ProgramState {
    return {base: relativebase, code: intcode, limit: pointerlimit, ptr: i, 
            halted: halted, waiting: waitinput, buffer: buffer, packet: packet, packetready: packetready};
}

export function getPacket(): { addr: number, x: number, y: number } {
    let p = packet; packet = { addr: null, x: null, y: null }; packetready = false;
    return p;
}

export function packetReady(): boolean {
    return packetready;
}

export function waiting(): boolean {
    return waitinput;
}

export function done(): boolean {
    return halted;
}

export function cpu(...input: number[]): number {
    if (input!==undefined) buffer.push(...input);

    while (i < pointerlimit) {     
        switch (intcode[i] % 100) { //last 1 or 2 digits of instruction
            case 1: intcode[write(i, 3)] = read(i, 1) + read(i, 2); i += 4; break;
            case 2: intcode[write(i, 3)] = read(i, 1) * read(i, 2); i += 4; break;
            case 3: if (buffer.length==0) { waitinput = true; return; }
                    else { waitinput = false; intcode[write(i, 1)] = buffer.shift(); i += 2; break; }
            case 4: i += 2; makePacket(read(i-2, 1)); return;
            case 5: i = read(i, 1) !== 0 ? read(i, 2) : i + 3; break;
            case 6: i = read(i, 1) ===   0 ? read(i, 2) : i + 3; break;
            case 7: intcode[write(i, 3)] = read(i, 1) < read(i, 2) ? 1 : 0; i += 4; break;
            case 8: intcode[write(i, 3)] = read(i, 1) === read(i, 2) ? 1 : 0; i += 4; break;
            case 9: relativebase += read(i, 1); i += 2; break;
            case 99: halted = true; return;
        }
    }
}

function makePacket(n: number): void {
    if (packet.addr===null) packet.addr = n;
    else if (packet.x===null) packet.x = n;
    else if (packet.y===null) { packet.y = n; packetready = true; }
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