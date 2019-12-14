import * as fs from 'fs';

type Reaction = { amount: number, stock: number, ingredients: Ingredient[] };
type Ingredient = { amount: number, type: string };

let reactions: { [result: string]: Reaction } = {};

fs.readFile("src/14/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    reactions = prepareReactions(text);

    console.log("Part 1:", getOre("FUEL"));
    console.log("Part 2:", search(1e12));
});

function search(ore: number): number {
    let min = 1, max = 2;
    while (true) { //estimate a starting interval
        restoreStock();
        if (getOre("FUEL", max) < ore) { min = max; max = Math.ceil(max*1.1); }
        else break;
    }

    while (true) { //narrow it down to 1 or 2 values
        restoreStock();
        let pivot = Math.floor((max + min) / 2);
        getOre("FUEL", pivot) <= ore ? min = pivot : max = pivot;
        if (max-min<=1) break;
    }
    
    //if max=min+1: min is the highest amount of fuel that ore lets us produce. one more (max) and we would go over that amount
    //if min=max: min is the exact amount of fuel that ore lets us produce. either min or max could be returned here
    return min;
}

function getOre(type: string, amount = 1): number {
    let total = 0, current = reactions[type], remainder: number;
    
    if (type==="ORE") return amount;
    if (current.stock > amount) { current.stock -= amount; return 0; }

    amount -= current.stock;
    remainder = current.amount - (amount%current.amount);
    if (remainder == current.amount) remainder = 0; current.stock = remainder;

    for (let ingredient of current.ingredients)
        total += getOre(ingredient.type, ingredient.amount * Math.ceil(amount/current.amount));
    
    return total;
}

function restoreStock(): void {
    Object.keys(reactions).forEach(key => reactions[key].stock = 0);
}

function prepareReactions(list: string): { [result: string]: Reaction } {
    let reactions: { [result: string]: Reaction } = {}; list.split("\n").forEach(equation => {
        let sides = equation.split(" => "), leftside = sides[0].split(", "), rightside = sides[1].split(" ");
        reactions[rightside[1]] = { amount: parseInt(rightside[0]), stock: 0, ingredients: [] };
        leftside.forEach(ingredient => {
            let vals = ingredient.split(" ");
            reactions[rightside[1]].ingredients.push({ amount: parseInt(vals[0]), type: vals[1] });
        });
    });
    return reactions;
}