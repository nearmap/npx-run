import splitArgs from 'string-argv';

import {groups} from './iterables';


const scriptKeys = (scripts)=> Object.keys(scripts);


function* getMatchingScripts(pattern, scripts) {
  if (scripts[pattern]) {
    yield pattern;
    return;
  }

  if (!pattern.includes('*')) {
    return;
  }

  const regex = new RegExp(`^${pattern.replace('*', '.*?')}$`);

  for (const script of scriptKeys(scripts)) {
    if (script.match(regex)) {
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
    const scriptCode = splitArgs(scripts[matchedScript]);
    yield [runArgs, matchedScript, scriptCode, scriptArgs];
  }
}


function* splitScripts(args, scripts) {
  let runArgs = null;

  for (const argGroup of groups(args, isScriptOrPattern(scripts))) {
    if (runArgs === null) {
      runArgs = argGroup;
    } else {
      yield * expandScriptPatterns(runArgs, argGroup, scripts);
    }
  }
}


export const parseArgs = (args, scripts)=> {
  const [arg] = args;
  const dryRun = (arg === '--dry-run');
  const help = (arg === '--help');

  const remainingArgs = dryRun ? args.slice(1) : args;
  const finalArgs = remainingArgs.length ? remainingArgs : ['default'];

  const tasks = splitScripts(finalArgs, scripts);

  return {tasks, dryRun, help};
};
