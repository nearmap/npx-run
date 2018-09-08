import fs from 'fs';

import npx from 'libnpx';
import chalk from 'chalk';

import {process} from './globals';
import {showHelp} from './help';
import {getScripts} from './scripts';
import run from './run';


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
    npx.mockImplementation(()=> Promise.resolve(0));
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
    const exitCode = await run('--dry-run', 'test');

    expect(getScripts).toHaveBeenCalledWith('test-dir', fs);
    expect(getStdoutData()).toBe([
      chalk`[{green test}] {dim run lint jest} `,
      chalk`[{green lint}] {dim run lint:*} `,
      chalk`[{green lint:md}] {dim remark --use remark-lint *.md} `,
      chalk`[{green lint:js}] {dim eslint .} `,
      chalk`[{green jest}] {dim jest} `,
      ''
    ].join('\n'));
    expect(npx).not.toHaveBeenCalled();
    expect(exitCode).toBe(0);
  });


  it('runs scripts using npx', async ()=> {
    const exitCode = await run('test');

    expect(getScripts).toHaveBeenCalledWith('test-dir', fs);
    expect(getStdoutData()).toBe(chalk`[{green test}] {dim run lint jest} \n`);
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
    expect(getStdoutData()).toBe(chalk`[{green jest}] {dim jest} \n`);
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


  it('stops running scripts on first failure', async ()=> {
    npx.mockImplementation(()=> Promise.resolve());

    const exitCode = await run('lint', 'jest');

    expect(getScripts).toHaveBeenCalledWith('test-dir', fs);
    expect(getStdoutData()).toBe(chalk`[{green lint}] {dim run lint:*} \n`);
    expect(npx).toHaveBeenCalledTimes(1);
    expect(npx).toHaveBeenCalledWith([[
      'path-to-node', 'path-to-runner',
      '--always-spawn', '--no-install',
      'run', 'lint:*'
    ]]);
    expect(exitCode).toBe(-1);
  });
});
