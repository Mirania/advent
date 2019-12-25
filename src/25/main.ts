import * as fs from 'fs';
import * as program from './intcode';

let intcode: number[];

fs.readFile("src/25/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    intcode = text.split(",").map(value => parseInt(value));
    
    play();
});

function play(): void {
    program.init(intcode);
    printStatus();
    loop();
}

function loop(): void {
    prompt("> ", (command) => {
        program.cpu(command);
        printStatus();
        if (program.done() || !program.waiting()) process.exit();
        loop();
    })
}

function printStatus(): void {
    while (true) {
        let out = program.cpu(); if (program.waiting() || program.done()) break;
        process.stdout.write(out > 127 ? out.toString() : String.fromCharCode(out));
    }
}

function prompt(question: string, callback: (command: string) => void): void {
    process.stdin.resume(); process.stdout.write(question);
    process.stdin.once('data', function(data: Buffer) {
        let command = data.toString().replace(/\r/g,"");
        if (command==="exit\n") process.exit();
        callback(command);
    });
}