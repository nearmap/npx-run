import splitArgs from 'string-argv';

import {groups, headTail} from './iterables';


export const scriptKeys = (scripts)=> Object.keys(scripts);

export const isPattern = (scriptOrPattern)=> scriptOrPattern.includes('*');


function* getMatchingScripts(scriptOrPattern, scripts) {
  if (scripts[scriptOrPattern]) {
    yield scriptOrPattern;
    return;
  }

  if (!isPattern(scriptOrPattern)) {
    return;
  }

  const pattern = new RegExp(`^${scriptOrPattern.replace(/\*/g, '.*?')}$`);

  for (const script of scriptKeys(scripts)) {
    if (script.match(pattern)) {
      yield script;
    }
  }
}


const isScriptOrPattern = (scripts)=> (pattern)=> {
  const [first] = getMatchingScripts(pattern, scripts);
  return (first !== undefined);
};


function* expandScriptPatterns(runArgs, [pattern, ...scriptArgs], scripts) {
  for (const matchedScript of getMatchingScripts(pattern, scripts)) {
    const command = splitArgs(scripts[matchedScript]);
    yield [runArgs, matchedScript, [...command, ...scriptArgs]];
  }
}

export const splitByScripts = (args, scripts)=> (
  groups(args, isScriptOrPattern(scripts))
);


function* getTasks(args, scripts) {
  const [runArgs, scriptsAndArgs] = headTail(splitByScripts(args, scripts));

  for (const argGroup of scriptsAndArgs) {
    yield * expandScriptPatterns(runArgs, argGroup, scripts);
  }
}


export const parseArgs = (args, scripts)=> {
  const [arg] = args;
  const dryRun = (arg === '--dry-run');
  const help = (arg === '--help');

  const remainingArgs = dryRun ? args.slice(1) : args;
  const finalArgs = remainingArgs.length ? remainingArgs : ['default'];

  const tasks = getTasks(finalArgs, scripts);

  return {tasks, dryRun, help};
};
