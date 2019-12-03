import * as fs from 'fs';

fs.readFile("src/2/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    let input: number[] = text.split(",").map((str) => parseInt(str));

    console.log("Part 1:", check(input.slice(0), 12, 2));
    
    for (let noun=0; noun<=99; noun++)
        for (let verb=0; verb<=99; verb++)
            if (check(input.slice(0), noun, verb)===19690720)
                { console.log("Part 2:", 100*noun+verb); return; }
});

function check(input: number[], noun: number, verb: number): number {
    input[1] = noun, input[2] = verb;
    
    for (let i=0; i<input.length; i+=4) {
        switch (input[i]) {
            case 1: input[input[i+3]] = input[input[i+1]] + input[input[i+2]]; break;
            case 2: input[input[i+3]] = input[input[i+1]] * input[input[i+2]]; break;
            case 99: return input[0];
        }
    }
}