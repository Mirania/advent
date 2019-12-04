import * as fs from 'fs';

fs.readFile("src/4/input.txt", {encoding: 'utf8'}, (err, text) => {
    if (err) { console.log(err); return; }
 
    let input = text.split("-").map(v => parseInt(v));
    let max = input[1];
    let min = input[0];
    let count1 = 0, count2 = 0;

    for (let i=min; i<=max; i++) {
        let n = i.toString();
        if (increasingDigits(n)) {
            if (adjacentAnyDigits(n)) count1++;
            if (adjacentTwoDigits(n)) count2++;
        }
    }

    console.log("Part 1:",count1);
    console.log("Part 2:",count2);
});

function adjacentAnyDigits(p: string): boolean {
    return p[0]===p[1] || p[1]===p[2] || p[2]===p[3] || p[3]===p[4] || p[4]===p[5];
}

function adjacentTwoDigits(p: string): boolean {
    return (p[0]===p[1] && p[1]!==p[2]) || (p[1]===p[2] && p[0]!==p[1] && p[2]!==p[3]) ||
           (p[2]===p[3] && p[1]!==p[2] && p[3]!==p[4]) || (p[3]===p[4] && p[2]!==p[3] && p[4]!==p[5]) ||
           (p[4]===p[5] && p[3]!==p[4]);
}

function increasingDigits(p: string): boolean {
    return p[0]<=p[1] && p[1]<=p[2] && p[2]<=p[3] && p[3]<=p[4] && p[4]<=p[5];
}