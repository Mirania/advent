import * as fs from 'fs';

fs.readFile("src/1/input.txt", {encoding: 'utf8'}, (err, text) => {
    if (err) { console.log(err); return; }
 
    console.log((text.split("\n") as any[]).reduce((prev,cur) => prev+Math.max(0, Math.floor(cur/3)-2), 0));
});