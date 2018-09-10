import chalk from 'chalk';
import splitArgs from 'string-argv';
import {headTail} from './iterables';
import {splitByScripts, isPattern} from './parse-args';


const formattedScriptOrPattern = (scriptOrPattern)=> (
  isPattern(scriptOrPattern)
    ? chalk`{blue ${scriptOrPattern}}`
    : chalk`{green ${scriptOrPattern}}`
);


function* formattedRunGroups(args, scripts) {
  const [runArgs, scriptsAndArgs] = headTail(splitByScripts(args, scripts));

  if (runArgs.length) {
    yield chalk`{dim ${runArgs.join(' ')}}`;
  }

  for (const [scriptOrPattern, ...scriptArgs] of scriptsAndArgs) {
    const name = formattedScriptOrPattern(scriptOrPattern);
    if (scriptArgs.length) {
      yield `${name} ${scriptArgs.join(' ')}`;
    } else {
      yield name;
    }
  }
}

export const formattedScriptName = (scriptName)=> (
  (scriptName === 'default')
    ? chalk`{bold.green ${scriptName}}`
    : chalk`{green ${scriptName}}`
);


export const formattedScript = (name, scripts)=> {
  const [cmd, ...args] = splitArgs(scripts[name]);

  if (cmd === 'run') {
    const groups = [...formattedRunGroups(args, scripts)].join(' ');
    return chalk`{bold run} ${groups}`;
  }
  return chalk`${cmd} {dim ${args.join(' ')}}`;
};
