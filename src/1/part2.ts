import * as fs from 'fs';

fs.readFile("src/1/input.txt", {encoding: 'utf8'}, (err, text) => {
    if (err) { console.log(err); return; }

    console.log((text.split("\n") as any[]).reduce((prev, cur) => {
        do { cur = Math.max(0, Math.floor(cur/3)-2); prev += cur } while (cur>0);
        return prev;
    }, 0));
});