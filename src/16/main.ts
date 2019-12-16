import * as fs from 'fs';

fs.readFile("src/16/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    let input: number[] = text.split("").map((value) => parseInt(value));
    console.log("Part 1:", fft(input, 100));
    let largeinput: number[] = text.repeat(10000).split("").map((value) => parseInt(value));
    console.log("Part 2:", cheesyfft(largeinput, 100));
});

const base = [0, 1, 0, -1];

//patternidx = [1, +oo[, outputidx = [1,+oo[
let multiplier = (patternidx: number, outputidx: number) => base[Math.floor(patternidx/outputidx)%4];

function fft(input: number[], phases: number): number[] {
    let phase = (input: number[]) => input.map((_,outputidx) => 
                                        Math.abs(input.reduce((prev,cur,patternidx) =>
                                            prev + cur * multiplier(patternidx+1, outputidx+1), 0) % 10));

    let out = input.slice(0);         
    for (let i=0; i<phases; i++) out = phase(out);
    return out.slice(0,8);
}

function cheesyfft(largeinput: number[], phases: number) {
    let offset = parseInt(largeinput.slice(0, 7).join(""));
    largeinput = largeinput.slice(offset, largeinput.length);

    for (let p=0; p<phases; p++) {
        let digit = 0;
        for (let i=largeinput.length-1; i>=0; i--) {
            digit = (largeinput[i]+digit) % 10;
            largeinput[i] = digit;
        }
    }

    return largeinput.slice(0,8);
}