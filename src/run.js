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


const runSingle = async (dryRun, runArgs, [cmd, ...args])=> {
  // TODO: could run this right away even if not in dry-run
  if (dryRun && cmd === 'run') {
    // eslint-disable-next-line no-use-before-define
    return await run('--dry-run', ...args);
  }

  if (!dryRun) {
    const result = await runCmd(runArgs, [cmd, ...args]);
    if (result === undefined) {
      return -1;
    }
    return result.code;
  }

  return 0;
};


const runAll = async (tasks, dryRun)=> {
  let count = 0;

  for (const [runArgs, script, cmd, scriptArgs] of tasks) {
    count += 1;
    print`[{green ${script}}] {dim ${cmd}} ${scriptArgs}`;

    const result = await runSingle(dryRun, runArgs, [...cmd, ...scriptArgs]);

    if (result !== 0) {
      return [count, result];
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

  const [numTasksRun, exitCode] = await runAll(tasks, dryRun);

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
