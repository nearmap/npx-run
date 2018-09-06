import run from '.';


export const main = async (process)=> {
  const [, , ...args] = process.argv;
  process.exit(await run(...args));
};


/* istanbul ignore if */
if (require.main === module) {
  main(process);
}
