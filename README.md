# npx-run

Easily run scripts using npx.


## installation

```bash
npm install --save-dev npx-run
```


## usage

Once you have installed `npx-run` as a dev-dependency you have a new
`run` executable in your `node_modules/.bin/` directory that `npx` can use.

To see what scripts you can run and what they do you can use the built-in help:

```bash
npx run --help
```


Examples:
```bash
npx run
npx run clean build
npx run lint:*
npx run --inspect-brk jest
```

### patterns

You can run a number of scripts using patterns.
Available scripts will be matched against the pattern and run in lexicographical
order of their names.

Note that arguments passed to a pattern e.g. `npx run foo:* --arg1`
will be passed to each matching script.


### dry-run

If you want to explore what `npx-run` will execute without actually running the
scripts you can use `--dry-run`.

Example:
```bash
npx run --dry-run lint:*
```

Output:
```
[lint:js] eslint --report-unused-disable-directives --ignore-path .gitignore .
[lint:md] remark --no-stdout --use remark-lint *.md
```


## scripts

Scripts are always run in a new process using `libnpx`.

Any arguments passed to `npx-run` that are not part of `npx-run`
are passed to `libnpx` as node-args when running scripts.

Any arguments given after a script name and before the next are passed to their
scripts respectively.

This allows you to e.g. run a debugger against your scripts.

Example:
```bash
npx run --inspect-brk jest --runInBand
```

The above will execute the `jest` script using `libnpx`
using `--inspect-brk` as a node-arg,
the `jest` script source as the command,
and  `--runInBand` as extra argument to the command.

`npx-run` supports multiple sources for scripts:


### npm run-scripts

Any script defined in `package.json` that can be run with `npm run` can also
be run with `npx run`.

`<package-root>/package.json`:
```javascript
{
  ...
  "scripts": {
    "default": "run clean test",
    "clean": "rimraf ./build",
    "test": "run lint:* jest",
    "lint:js": "eslint .",
    "lint:md": "remark --no-stdout --use remark-lint *.md",
    "jest": "jest --no-cache"
  },
  ...
}
```

> **Note:**
> For now these scripts are run using `npx` not using `npm run`
> and will have a different environment.
> This may change in the future to fully support the same `npm run` behaviour.


### ./scripts module

You can define all your scripts in a `scripts` module at the root of your
package by exporting an object containing all script commands as default:

`<package-root>/scripts.js`:
```javascript

export default {
  default: 'run clean test'
  clean: 'rimraf ./build',
  test: 'run lint:* jest',
  'lint:js': 'eslint .',
  'lint:md': 'remark --no-stdout --use remark-lint *.md',
  jest: 'jest --no-cache'
}
```


### ./scripts/* modules

Instead of putting commands into scripts objects via `npm-scripts` or
the `scripts` module you can create a `scripts/` module directory at the
root of your package and place scripts inside of it.

The optional `index.js` is used as the `scripts` module described above and all
other files are scripts that can be run with `npx run <name>`.

Example:
```
<package-root>
  ├── scripts
  │   ├── index.js   
  │   ├── deploy.js
  │   ├── ...
```

```bash
npx run clean test build deploy
```


### scritps precedence

`scripts/* modules > scripts module > package.json`

JS modules inside the `<package-root>/scripts/` directory will be used rather
than a script of the same name defined in the `<package-root>/scripts` module.
The latter are used rather than a script defined in `<package-root>/package.json`.
