import * as fs from 'fs';

let originalcode: number[], highest: number;

fs.readFile("src/7/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    originalcode = text.split(",").map((value) => parseInt(value));

    highest = 0;
    for (let perm of permutations([0,1,2,3,4]))
        highest = Math.max(highest, amp(perm[0]).amp(perm[1]).amp(perm[2]).amp(perm[3]).amp(perm[4]).signal);  
    console.log("Part 1:", highest);

    highest = 0;
    for (let perm of permutations([5,6,7,8,9])) {
        let A: Amplifier, B: Amplifier, C: Amplifier, D: Amplifier, E: Amplifier, last = 0;
        while (true) {
            A = A ? A.restore(E.signal) : amp(perm[0]);           if (!A) break;
            B = B ? B.restore(A.signal) : amp(perm[1], A.signal); if (!B) break;
            C = C ? C.restore(B.signal) : amp(perm[2], B.signal); if (!C) break;
            D = D ? D.restore(C.signal) : amp(perm[3], C.signal); if (!D) break;
            E = E ? E.restore(D.signal) : amp(perm[4], D.signal); if (!E) break;
            last = E.signal;
        }
        highest = Math.max(highest, last); 
    }
    console.log("Part 2:", highest);
});

interface Amplifier { signal: number, amp: (phase: number) => Amplifier, restore: (signal: number) => Amplifier };

function amp(phase: number, signal = 0, intcode = originalcode.slice(0), i = 0, phaseread = false): Amplifier {
    while (i < intcode.length) {
        switch (intcode[i] % 100) { //last 1 or 2 digits of instruction
            case 1: intcode[intcode[i + 3]] = resolve(i, 1) + resolve(i, 2); i += 4; break;
            case 2: intcode[intcode[i + 3]] = resolve(i, 1) * resolve(i, 2); i += 4; break;
            case 3: intcode[intcode[i + 1]] = phaseread ? signal : phase; phaseread = true; i += 2; break;
            case 4: return {
                signal: resolve(i, 1), 
                amp: (phase: number): Amplifier => amp(phase, resolve(i, 1)),
                restore: (signal: number): Amplifier => amp(phase, signal, intcode, i+2, true)
            };
            case 5: i = resolve(i, 1) !== 0 ? resolve(i, 2) : i + 3; break;
            case 6: i = resolve(i, 1) === 0 ? resolve(i, 2) : i + 3; break;
            case 7: intcode[intcode[i + 3]] = resolve(i, 1) < resolve(i, 2) ? 1 : 0; i += 4; break;
            case 8: intcode[intcode[i + 3]] = resolve(i, 1) === resolve(i, 2) ? 1 : 0; i += 4; break;
            case 99: return undefined;
        }
    }

    //if mode is set (=instruction[modeindex] exists) and is 1, return argument, else return intcode[argument]
    function resolve(pointer: number, argposition: number): number {
        let instruction = intcode[pointer].toString();
        return instruction[instruction.length - 2 - argposition] === "1" ? intcode[pointer + argposition] : intcode[intcode[pointer + argposition]];
    }
}

//adapted from https://stackoverflow.com/a/40655691
function permutations(numbers: number[]): number[][] {
    let all: number[][] = [], tmp: number[] = [],
        nodup = (checked = {}): boolean => !tmp.some(l => checked[tmp[l]] ? true : (checked[tmp[l]] = true) && false),
        iter = (col: number): void => {
            if (col === numbers.length) { if (nodup()) { let p = []; tmp.forEach(l => p.push(numbers[l])); all.push(p); } }
            else { numbers.forEach((_, i) => { tmp[col] = i; iter(col + 1) }); }
        };
    iter(0); return all;
}