import * as fs from 'fs';
import * as program from './intcode';

let intcode: number[];

fs.readFile("src/23/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    intcode = text.split(",").map(value => parseInt(value));

    console.log("Part 1:", network(true));
    console.log("Part 2:", network(false));

});

let skipToNextInput = () => { while (!program.waiting()) program.cpu(); };

function network(getFirstNatPacket: boolean): number {
    let cpus: program.ProgramState[] = [];
    let queue: { x: number, y: number }[][] = [];
    let nat: { x: number, y: number };
    let lastY: number, idleCount: number;

    for (let i = 0; i < 50; i++) {
        program.init(intcode); skipToNextInput(); program.cpu(i);
        cpus.push(program.state()); queue[i] = [];
    }

    while (true) {
        idleCount = 0;
        for (let i = 0; i < 50; i++) {
            program.stateset(cpus[i]);

            if (program.waiting()) { //need input
                if (queue[i].length === 0) { //empty queue
                    program.cpu(-1); idleCount++;
                    if (idleCount === 50 && nat !== undefined) { //send packet from nat to 0
                        queue[0].push({ x: nat.x, y: nat.y });
                        if (!getFirstNatPacket && lastY !== undefined && lastY === nat.y) return nat.y;
                        else lastY = nat.y;
                    }
                }
                else { let packet = queue[i].shift(); program.cpu(packet.x, packet.y); } //consume packet from queue

            } else { //have output
                program.cpu();
                if (program.packetReady()) {
                    let p = program.getPacket();
                    if (p.addr >= 0 && p.addr <= 49) queue[p.addr].push({ x: p.x, y: p.y }); //send to queue
                    if (p.addr === 255) { //send to nat
                        nat = { x: p.x, y: p.y };
                        if (getFirstNatPacket) return p.y;
                    }
                }
            }

            cpus[i] = program.state();
        }
    }
}