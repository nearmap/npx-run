import fs from 'fs';

import npx from 'libnpx';
import chalk from 'chalk';

import {process} from './globals';
import {showHelp} from './help';
import {getScripts} from './scripts';
import run from './run';


jest.mock('chalk', ()=> (parts, ...args)=> String.raw({raw: parts}, ...args));


jest.mock('libnpx', ()=> {
  const fn = jest.fn();
  fn.parseArgs = jest.fn((...args)=> args);
  return fn;
});


jest.mock('./globals', ()=> ({
  process: {
    argv: ['path-to-node', 'path-to-runner'],
    cwd: ()=> 'test-dir',
    stdout: {write: jest.fn()}
  }
}));

jest.mock('./help');

jest.mock('./scripts', ()=> ({
  getScripts: jest.fn()
}));


const getStdoutData = ()=> (
  process.stdout.write.mock.calls.map(([data])=> data).join('')
);


describe('run()', ()=> {
  const mockScripts = {
    default: 'run test',
    test: 'run lint jest',
    lint: 'run lint:*',
    'lint:md': 'remark --use remark-lint *.md',
    'lint:js': 'eslint .',
    jest: 'jest'
  };

  beforeEach(()=> {
    npx.mockImplementation(()=> Promise.resolve({code: 0}));
    getScripts.mockImplementation(()=> mockScripts);
  });


  it('shows --help', async ()=> {
    const exitCode = await run('--help');

    expect(getScripts).toHaveBeenCalledWith('test-dir', fs);
    expect(showHelp).toHaveBeenCalledWith(mockScripts);
    expect(getStdoutData()).toBe('');
    expect(npx).not.toHaveBeenCalled();
    expect(exitCode).toBe(0);
  });


  it('lists scripts in --dry-run', async ()=> {
    const exitCode = await run('--dry-run', 'test', '--verbose');

    expect(getScripts).toHaveBeenCalledWith('test-dir', fs);
    expect(getStdoutData()).toBe([
      chalk`[{green test}] {bold run} {green lint} {green jest} --verbose`,
      chalk`[{green lint}] {bold run} {blue lint:*}`,
      chalk`[{green lint:md}] remark {dim --use remark-lint *.md}`,
      chalk`[{green lint:js}] eslint {dim .}`,
      chalk`[{green jest}] jest {dim --verbose}`,
      ''
    ].join('\n'));
    expect(npx).not.toHaveBeenCalled();
    expect(exitCode).toBe(0);
  });


  it('runs scripts using npx', async ()=> {
    const exitCode = await run('test');

    expect(getScripts).toHaveBeenCalledWith('test-dir', fs);
    expect(getStdoutData()).toBe(
      chalk`[{green test}] {bold run} {green lint} {green jest}\n`
    );
    expect(npx).toHaveBeenCalledWith([[
      'path-to-node', 'path-to-runner',
      '--always-spawn', '--no-install',
      'run', 'lint', 'jest']]
    );
    expect(exitCode).toBe(0);
  });


  it('runs scripts using npx with node args', async ()=> {
    const exitCode = await run('--inspect', 'jest');

    expect(getScripts).toHaveBeenCalledWith('test-dir', fs);
    expect(getStdoutData()).toBe(chalk`[{green jest}] jest {dim }\n`);
    expect(npx).toHaveBeenCalledWith([[
      'path-to-node', 'path-to-runner',
      '--always-spawn', '--no-install', '--node-arg=--inspect',
      'jest'
    ]]);
    expect(exitCode).toBe(0);
  });


  it('shows error if no scripts were run', async ()=> {
    const exitCode = await run('foobar');

    expect(getScripts).toHaveBeenCalledWith('test-dir', fs);
    expect(getStdoutData()).toBe([
      chalk`{red scripts not found}`,
      '',
      'For available scripts run:',
      'npx run --help\n\n'
    ].join('\n'));

    expect(getScripts).toHaveBeenCalledWith('test-dir', fs);
    expect(npx).not.toHaveBeenCalled();
    expect(exitCode).toBe(-1);
  });


  it('stops running scripts when npx returns undefined', async ()=> {
    npx.mockImplementationOnce(()=> Promise.resolve({code: 0}));
    npx.mockImplementationOnce(()=> Promise.resolve());

    const exitCode = await run('lint', 'jest');

    expect(getScripts).toHaveBeenCalledWith('test-dir', fs);
    expect(getStdoutData()).toBe(
      chalk`[{green lint}] {bold run} {blue lint:*}\n` +
      chalk`[{green jest}] jest {dim }\n`
    );
    expect(npx).toHaveBeenCalledTimes(2);
    expect(npx).toHaveBeenCalledWith([[
      'path-to-node', 'path-to-runner',
      '--always-spawn', '--no-install',
      'run', 'lint:*'
    ]]);
    expect(exitCode).toBe(-1);
  });

});
