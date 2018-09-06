import {print} from './strings';

/* eslint-disable max-len */
export const showHelp = (scripts)=> {
  print`
    npx run {dim [run-args] [node-args]} <{green script}|{blue pattern}> [srcipt-args] ...

    Examples:
      npx run
      npx run {green clean} {green build}
      npx run {green config} --env='testing' {green build} {green deploy}
      npx run {blue lint:*}
      npx run --inspect-brk {green jest}

    'default' script:
      When runnign without any arguemtns npx run will run the
      'default' script if it has been defined.

    run-args:
      --help         Show this help.
      --dry-run      List scripts to be run, but don't run them.

    node-args:
      Any args before the first script are sent to npx as node args.
      --inspect      Run node with --inspect to debug scripts.
      --inspect-brk  Run node with --inspect-brk to debug scripts
      ...
  `;

  const keys = Object.keys(scripts).sort();
  const maxLen = Math.max(...keys.map((key)=> key.length));

  if (keys.length) {
    print`scripts:`;

    for (const key of keys) {
      print`  {green ${key.padEnd(maxLen)}}  ${scripts[key]}`;
    }
  } else {
    print`
      {red no scripts discoverd}

      You can add scripts using:

        ./package.json   - using npm run-scripts
        ./scripts module - exporting a single object working the same as
                           the package.json run-scripts.
        ./scripts/*.js   - using any loadable nodejs module which is run
                           as a script given its basename

      ./scripts/*.js modules will override scripts of the same name defined in
      the ./scripts module.
      Scripts defined in the ./scripts module will override scripts of the same
      name defined in ./package.json.
    `;
  }

};
