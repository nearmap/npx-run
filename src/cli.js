#!/usr/bin/env node

import run from './run';


export const main = async (process)=> {
  const [, , ...args] = process.argv;
  process.exit(await run(...args));
};


/* istanbul ignore if */
if (require.main === module) {
  main(process);
}
