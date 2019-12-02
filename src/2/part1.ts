import * as fs from 'fs';

fs.readFile("src/2/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    text.split(",").map((str,idx) => idx==1 ? 12 : idx==2 ? 2 : parseInt(str)).map((val,idx,arr) => 
        idx%4!=0 ? idx : val==99 ? console.log(arr[0]) : 
                         val==1 ? arr[arr[idx+3]] = arr[arr[idx+1]] + arr[arr[idx+2]] :
                         val==2 ? arr[arr[idx+3]] = arr[arr[idx+1]] * arr[arr[idx+2]] : undefined);
});