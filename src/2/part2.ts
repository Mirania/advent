import * as fs from 'fs';

fs.readFile("src/2/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    let input = text.split(",").map((str) => parseInt(str));

    for (let i=0; i<10000; i++) {
        input.slice(0).map((val, idx) => 
            idx==1 ? Math.floor(i/100) : idx==2 ? i-Math.floor(i/100)*100 : val)
                      .map((val, idx, arr) =>
            idx%4!=0 ? idx : val==99 ? (arr[0] == 19690720 ? console.log(i) : undefined) :
                             val==1 ? arr[arr[idx+3]] = arr[arr[idx+1]] + arr[arr[idx+2]] :
                             val==2 ? arr[arr[idx+3]] = arr[arr[idx+1]] * arr[arr[idx+2]] : undefined);
    }
});

/**
 * i = noun*100+verb;
 * noun = Math.floor(i/100) = [0,99];
 * verb = i-Math.floor(i/100)*100 = [0,99];
 */