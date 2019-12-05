import * as fs from 'fs';

fs.readFile("src/5/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }
 
    let part: 1|2 = 2,
        code: number[] = text.split(",").map((value) => parseInt(value)),
        r = (ptr: number, pos: number): number => code[ptr].toString()[code[ptr].toString().length-2-pos]==="1"?code[ptr+pos]:code[code[ptr+pos]];
    
    for (let i=0, op=code[i]%100; i<code.length; op=code[i]%100)
        op==1 ? code[code[i+3]] = r(i,1)+r(i,2) :
        op==2 ? code[code[i+3]] = r(i,1)*r(i,2) :
        op==3 ? code[code[i+1]] = ((part as number)===1 ? 1 : 5) :
        op==4 ? console.log(r(i,1)) :
        op==5 ? i = (r(i,1)!==0 ? r(i,2) : i+3)  :
        op==6 ? i = (r(i,1)===0 ? r(i,2) : i+3)  :
        op==7 ? code[code[i+3]] = (r(i,1)<r(i,2) ? 1 : 0) :
        op==8 ? code[code[i+3]] = (r(i,1)===r(i,2) ? 1 : 0) :
        op==99 ? i = code.length : undefined,
        op==1 ? i+=4 : op==2 ? i+=4 : op==3 ? i+=2 : op==4 ? i+=2 : op==7 ? i+=4 : op==8 ? i+=4 : undefined;
});