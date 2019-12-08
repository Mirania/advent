import * as fs from 'fs';

let layers: string[];

fs.readFile("src/8/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    let width = 25, height = 6;
    layers = text.match(new RegExp(`.{${width*height}}`, "g"));

    let correctLayer = layers[layers.map(x => count(0, x)).reduce((min,cur,idx,arr) => cur<arr[min] ? idx : min, 0)];
    console.log("Part 1: ", count(1, correctLayer) * count(2, correctLayer));

    let image: string[] = [];
    for (let i=0; i<width*height; i++) {
        if (i%width===0) image.push("\n");
        image.push(color(i)=="0" ? " " : "█"); //swap black and white chars if it's hard to read
    }
    console.log("Part 2: ", image.join(""));
});

let count = (char: any, string: string) => (string.match(new RegExp(char, "g")) || []).length;

let color = (px: number) => layers.map(layer => layer[px]).reduceRight((prev,cur) => cur=="2" ? prev : cur, "2");