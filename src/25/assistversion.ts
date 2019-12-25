import * as fs from 'fs';
import * as program from './intcode';

let intcode: number[];
let assistOn = false;
let assistData: { lastLoc: string, locs: { [loc: string]: { items: string[], explore: string[] } }, 
                  inv: string[], tries: { [hash: string]: string } };
assistData = {lastLoc: undefined, locs: {}, inv: [], tries: {} };

fs.readFile("src/25/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    intcode = text.split(",").map(value => parseInt(value));

    play(true);
});

function play(enableAssist: boolean): void {
    assistOn = enableAssist; 
    program.init(intcode);
    let out = status();
    if (assistOn) updateAssistance(out);
    process.stdout.write(out); 
    loop();
}

function loop(): void {
    prompt("> ", (command) => {
        program.cpu(command); let out = status();
        if (assistOn) updateAssistance(out, command);
        process.stdout.write(out); 
        if (program.done() || !program.waiting()) process.exit();
        loop();
    });
}

function status(): string {
    let fulloutput = "";
    while (true) {
        let out = program.cpu(); if (program.waiting() || program.done()) break;
        fulloutput += out > 127 ? out.toString() : String.fromCharCode(out);
    }
    return fulloutput;
}

function updateAssistance(output: string, input?: string): void {
    if (output.includes("Unrecognized command") || output.includes("You don't have that item") || 
        output.includes("You can't go that way") || output.includes("You don't see that item here")) return;

    let lines = output.split("\n");
    let command = input ? input.replace(/(\r|\n)/g,"") : undefined;
    let location: string; let locidx = lines.findIndex(line => line.includes("=="));
    location = locidx===-1 ? assistData.lastLoc : lines[locidx].replace(/(== | ==)/g, "");

    if (!assistData.locs[location]) {
        let dirs: string[] = []; let diridx = lines.findIndex(line => line.includes("Doors here lead:"));
        for (let i=diridx+1; i<lines.length; i++) { if (lines[i]==="") break; dirs.push(lines[i].replace("- ","")) }
        let items: string[] = []; let itemidx = lines.findIndex(line => line.includes("Items here:"));
        for (let i=itemidx+1; i<lines.length; i++) { if (lines[i]==="") break; items.push(lines[i].replace("- ", "")) }
        assistData.locs[location] = {items: items, explore: dirs};
    }

    if (command && assistData.lastLoc) {
        let last = assistData.locs[assistData.lastLoc];
        if (["west","east","north","south"].includes(command)) {
            last.explore = last.explore.filter(dir => dir!==command);
            if (location==="Pressure-Sensitive Floor") {
                let itemlist = assistData.inv.sort();
                let hash = itemlist.join(", ");
                let infoidx = lines.findIndex(line => line.includes("Alert! Droids on this ship"));
                if (infoidx===-1) return;
                let conclusion = lines[infoidx].includes("heavier");
                if (!assistData.tries[hash]) assistData.tries[hash] = conclusion ? "Too light" : "Too heavy";
            }
        }
        else if (command.includes("take ")) {
            let it = command.replace("take ", "");
            last.items = last.items.filter(item => item!==it);
            assistData.inv.push(it);
        }
        else if (command.includes("drop ")) {
            let it = command.replace("drop ", "");
            last.items.push(it);
            assistData.inv = assistData.inv.filter(item => item!==it);
        }
    }

    assistData.lastLoc = location;
}

function assist(): void {
    let items = [], explore = [], tries = [];
    for (let loc in assistData.locs) {
        if (loc === "Pressure-Sensitive Floor") continue;
        for (let item of assistData.locs[loc].items) items.push(`- The ${item} is at the ${loc}.`);
        for (let dir of assistData.locs[loc].explore) explore.push(`- You have not gone ${dir} at the ${loc}.`);
    }
    for (let items in assistData.tries) {
        tries.push(`- ${assistData.tries[items]}: ${items}`);
    }
    if (items.length>0) {
        console.log("Items:");
        console.log(items.join("\n"));
    }
    if (explore.length>0) {
        console.log("Exploration:");
        console.log(explore.join("\n"));
    }
    if (tries.length > 0) {
        console.log("Weight:");
        console.log(tries.join("\n"));
    }
    console.log("\nCommand?");
}

function prompt(question: string, callback: (command: string) => void): void {
    process.stdin.resume(); process.stdout.write(question);
    process.stdin.once('data', function(data: Buffer) {
        let command = data.toString().replace(/\r/g,"");
        if (command==="assist\n" && assistOn) { assist(); loop(); }
        else if (command==="exit\n") process.exit();
        else callback(command);
    });
}