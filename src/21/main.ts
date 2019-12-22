import * as fs from 'fs';
import * as program from './intcode';

let intcode: number[];

fs.readFile("src/21/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    intcode = text.split(",").map(value => parseInt(value));

    program.init(intcode); skipToNextInput();
    program.cpu("NOT C T\n"); // hole3
    program.cpu("NOT A J\n"); // hole1
    program.cpu("OR T J\n");  // (hole1 || hole3)
    program.cpu("AND D J\n"); // ground4 && (hole1 || hole3)
    console.log("Part 1:"), printStatusReport("walk");

    program.init(intcode); skipToNextInput();
    program.cpu("NOT F J\n"); // hole6
    program.cpu("OR H J\n");  // (ground8 || hole6)
    program.cpu("NOT C T\n"); // hole3
    program.cpu("AND T J\n"); // hole3 && (ground8 || hole6)
    program.cpu("NOT B T\n"); // hole2
    program.cpu("OR T J\n");  // hole2 || (hole3 && (ground8 || hole6))
    program.cpu("NOT A T\n"); // hole1
    program.cpu("OR T J\n");  // hole1 || (hole2 || (hole3 && (ground8 || hole6)))
    program.cpu("AND D J\n"); // ground4 && (hole1 || (hole2 || (hole3 && (ground8 || hole6))))
    console.log("Part 2:"), printStatusReport("run");
});

let skipToNextInput = () => { while (!program.waiting()) program.cpu(); };

function printStatusReport(mode: "walk" | "run"): void {
    while (true) {
        let out = program.cpu(`${mode==="walk" ? "WALK": "RUN"}\n`); if (program.done()) break;
        process.stdout.write(out>127 ? out.toString() : String.fromCharCode(out));
    }
    console.log("\n");
}