import * as fs from 'fs';

fs.readFile("src/3/input.txt", { encoding: 'utf8' }, (err, text) => {
    if (err) { console.log(err); return; }

    let wires = [{"0,0": {d: 0, p: [0,0]}}, {"0,0": {d: 0, p: [0,0]}}];
    text.split("\n").forEach((line,idx) => line.split(",")
                    .forEach(coord => {
                        for (let i=1, pts=Object.keys(wires[idx]), d=wires[idx][pts[pts.length-1]].d,
                            [x,y]=wires[idx][pts[pts.length-1]].p, steps=coord.substr(1) as any,
                            dir=coord[0]=="U"?[0,1]:coord[0]=="D"?[0,-1]:coord[0]=="L"?[-1,0]:[1,0]; i<=steps; i++)
                                wires[idx][`${x+i*dir[0]},${y+i*dir[1]}`] = {
                                    d: d+i,
                                    p: [x+i*dir[0], y + i*dir[1]]
                                };
                    }));

    console.log(Math.min(...Object.keys(wires[0]).filter(point => point!=="0,0" && wires[1][point])
                         .map(point => wires[0][point].d+wires[1][point].d)));
});

/**
 * wires = array of arrays (2 wires)
 * wire = array of points
 * each point = { "x,y": {steps(d): number, coords(p): [x, y]} }
 */