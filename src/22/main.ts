import * as fs from 'fs';

let commands: { type: number, value?: number }[] = [];
let decksize: number;

fs.readFile("src/22/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    commands = text.split("\n").map(line => {
        if (line[5] === "i") return { type: 1 }; //deal into new stack
        let args = line.split(" ");
        if (line[5] === "w") return { type: 2, value: parseInt(args[3]) }; //deal with increment
        return { type: 3, value: parseInt(args[1]) }; //cut
    });

    decksize = 10007;
    console.log("Part 1:", trackCard(2019));

    decksize = 119315717514047;
    console.log("Part 2:", trackPosition(2020, 101741582076661));
});

let negmod = (value: bigint, mod: bigint) => value < BigInt(0) ? (mod+value) % mod : value % mod;
let invmod = (value: bigint) => powmod(value, BigInt(decksize-2), BigInt(decksize));

function trackCard(card: number): number {
    commands.forEach(c => {
        switch (c.type) {
            case 1: card = decksize - card - 1; break;
            case 2: card = (c.value * card) % decksize; break;
            case 3: card = c.value > card ? decksize - c.value + card : card - c.value; break;
        }
    });
    return card;
}

//https://www.reddit.com/r/adventofcode/comments/ee0rqi/2019_day_22_solutions/fbnkaju/
function trackPosition(pos: number, repeats: number): number {
    let increment = BigInt(1), offset = BigInt(0), one = BigInt(1);
    let b_pos = BigInt(pos), b_decksize = BigInt(decksize), b_repeats = BigInt(repeats);

    commands.forEach(c => {
        switch (c.type) {
            case 1:
                increment = -increment;
                increment = negmod(increment, b_decksize);
                offset += increment;
                offset = negmod(offset, b_decksize);
                break;
            case 2:
                increment *= invmod(BigInt(c.value));
                increment = negmod(increment, b_decksize);
                break;
            case 3:
                offset += BigInt(c.value) * increment;
                offset = negmod(offset, b_decksize);
                break;
        }
    });

    let finalincrement = powmod(increment, b_repeats, b_decksize);
    let finaloffset = offset * (one - finalincrement) * invmod((one - increment) % b_decksize);
    finaloffset = negmod(finaloffset, b_decksize);

    return Number((finaloffset + b_pos * finalincrement) % b_decksize);
}

//https://stackoverflow.com/a/10539256
function powmod(x: bigint, y: bigint, z: bigint): bigint {
    let number = BigInt(1), one = BigInt(1);
    while (y) {
        if (y & one) number = number * x % z;
        y >>= one;
        x = x * x % z;
    }
    return number;
}