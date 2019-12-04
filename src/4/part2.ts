import * as fs from 'fs';

fs.readFile("src/4/input.txt", {encoding: 'utf8'}, (err, text) => {
    if (err) { console.log(err); return; }
 
    let input: number[] = text.split("-").map(v => parseInt(v)), 
        min: number = input[0], 
        max: number = input[1], 
        count: number = 0,
        part: 1|2 = 2,
        makeArray = (n: number): number[] => n.toString().split("").map(ch => parseInt(ch));

    for (let i=min, cur=makeArray(i); i<=max+1; cur=makeArray(++i)) {
        i==max+1 ? console.log(count) :
            JSON.stringify(cur)===JSON.stringify(cur.sort((a,b)=>a-b)) &&
            cur.map(d=>cur.reduce((t,x)=>(x==d?t+1:t),0)).some(amt=>part===1 ? amt>=2 : amt===2)
                ? count++ : undefined;
    }
});