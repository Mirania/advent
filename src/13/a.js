import * as program from './intcode';
const { IntcodeCPU } = require('./intcode');

const input = `shitcodeprogram`;

function fuckthisproblemandfuckintcode(mem) {
  const pattern = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1];
  const replace = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];

  for (let i = 0; i < mem.length - pattern.length; i++) {
    let found = true;
    for (let j = 0; j < pattern.length; j++) {
      if (mem[i + j] !== pattern[j]) found = false;
    }
    if (found) {
      for (let j = 0; j < replace.length; j++) {
        mem[i + j] = replace[j];
      }
      return;
    }
  }
}

function run() {
  const mem = input.split(',').map(x => parseInt(x, 10));
  mem[0] = 2;
  fuckthisproblemandfuckintcode(mem);
  const c = new IntcodeCPU(mem);

  let i = 0, x = 0, y = 0, score = 0, nb = 0;
  c.output.listen(v => {
    if (i % 3 === 0) x = v;
    else if (i % 3 === 1) y = v;
    else {
      if (x === -1 && y === 0) {
        score = v;
      } else if (v === 2) nb += 1;
    }
    i += 1;
  });

  while (c.running()) {
    c.input.write(0);
    c.step();
  }
  console.log('part 1:', nb);
  console.log('part 2:', score);
}

run();