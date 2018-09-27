import splitArgs from 'string-argv';

import {print} from './strings';
import {formattedScriptName, formattedScript} from './colorize';


export const scriptCompare = (name1, name2)=> {
  name1 = name1 === 'default' ? '' : name1;
  name2 = name2 === 'default' ? '' : name2;

  if (name1 > name2) {
    return 1;
  } else if (name1 < name2) {
    return -1;
  }
  return 0;
};


const printScripts = (scripts)=> {
  const scriptNames = Object.keys(scripts).sort(scriptCompare);
  const maxLen = Math.max(...scriptNames.map((key)=> key.length));

  print`{underline scripts}:`;

  for (const scriptName of scriptNames) {
    const name = formattedScriptName(scriptName);
    const command = splitArgs(scripts[scriptName]);
    const preview = formattedScript(command, scripts);
    const padding = maxLen - scriptName.length;

    print`  ${name} ${' '.repeat(padding)} ${preview}`;
  }

  return scriptNames.length;
};


/* eslint-disable max-len */
export const showHelp = (scripts)=> {
  print`
    npx {bold run} {dim [run-args] [node-args]} <{green script}|{blue pattern}> [srcipt-args] ...

    {underline Examples}:
      npx {bold run}
      npx {bold run} {green clean} {green build}
      npx {bold run} {green config} --env='testing' {green build} {green deploy}
      npx {bold run} {blue lint:*}
      npx {bold run} {dim --inspect-brk} {green jest}

    {underline default script}:
      When calling without any arguemtns 'npx run' will run the
      {bold.green default} script if it has been defined.

    {underline run-args}:
      --help         Show this help.
      --dry-run      List scripts to be run, but don't run them.

    {underline node-args}:
      Any args before the first script are sent to npx as node args.

      --inspect      Run node with --inspect to debug scripts.
      --inspect-brk  Run node with --inspect-brk to debug scripts
  `;

  if (!printScripts(scripts)) {
    print`
      {red no scripts discoverd}

      You can add scripts using:

        ./package.json   - using npm run-scripts
        ./scripts module - exporting a single default object working
                           the same as the package.json run-scripts.
        ./scripts/*.js   - using any loadable nodejs module which is run
                           as a script given its basename

      ./scripts/*.js modules will override scripts of the same name defined in
      the ./scripts module.
      Scripts defined in the ./scripts module will override scripts of the same
      name defined in ./package.json.
    `;
  }

};
