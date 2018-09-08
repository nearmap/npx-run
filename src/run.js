import fs from 'fs';

import npx from 'libnpx';

import {print} from './strings';
import {showHelp} from './help';
import {getScripts} from './scripts';
import {parseArgs} from './parse-args';
import {process} from './globals';


// TODO: this is not always curr dir
const findPackageDir = ()=> process.cwd();


const runCmd = async (nodeArgs, scriptArgs)=> {
  const npxArgs = npx.parseArgs([
    process.argv[0],
    process.argv[1],
    '--always-spawn',
    '--no-install',
    ...nodeArgs.map((a)=> `--node-arg=${a}`),
    ...scriptArgs
  ]);

  return await npx(npxArgs);
};


const runTasks = async (tasks, dryRun)=> {
  let count = 0;

  for (const [runArgs, script, scriptCode, scriptArgs] of tasks) {
    count += 1;

    print`[{green ${script}}] {dim ${scriptCode}} ${scriptArgs}`;

    if (dryRun && scriptCode[0] === 'run') {
      await run('--dry-run', ...scriptCode.slice(1), ...scriptArgs);
    } else if (!dryRun) {
      const result = await runCmd(runArgs, [...scriptCode, ...scriptArgs]);
      if (result === undefined) {
        return [count, -1];
      }
    }
  }

  return [count, 0];
};


const run = async (...args)=> {
  const scripts = getScripts(findPackageDir(), fs);
  const {tasks, dryRun, help} = parseArgs(args, scripts);

  if (help) {
    showHelp(scripts);
    return 0;
  }

  const [numTasksRun, exitCode] = await runTasks(tasks, dryRun);

  if (numTasksRun === 0) {
    print`
      {red scripts not found}

      For available scripts run:
      npx run --help
    `;
    return -1;
  }

  return exitCode;
};

export default run;
