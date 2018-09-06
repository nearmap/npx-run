import {parseArgs} from './parse-args';


describe('parseArgs()', ()=> {
  const scripts = {
    default: 'run test',
    test: 'run lint jest',
    lint: 'run lint:*',
    'lint:md': 'remark --use remark-lint *.md',
    'lint:js': 'eslint .',
    jest: 'jest'
  };


  it('parses --help', ()=> {
    const argv = ['--help'];

    const {tasks, dryRun, help} = parseArgs(argv, scripts);

    expect(help).toBe(true);
    expect(dryRun).toBe(false);
    expect([...tasks]).toEqual([]);
  });


  it('parses --dry-run', ()=> {
    const argv = ['--dry-run', 'test'];

    const {tasks, dryRun, help} = parseArgs(argv, scripts);

    expect(help).toBe(false);
    expect(dryRun).toBe(true);
    expect([...tasks]).toEqual([[[], 'test', ['run', 'lint', 'jest'], []]]);
  });


  it('uses `default` script when no args given', ()=> {
    const argv = [];

    const {tasks, dryRun, help} = parseArgs(argv, scripts);

    expect(help).toBe(false);
    expect(dryRun).toBe(false);
    expect([...tasks]).toEqual([[[], 'default', ['run', 'test'], []]]);
  });


  it('matches args against scripts and their args', ()=> {
    const argv = ['lint', 'jest', '--verbose'];

    const {tasks, dryRun, help} = parseArgs(argv, scripts);

    expect(help).toBe(false);
    expect(dryRun).toBe(false);
    expect([...tasks]).toEqual([
      [[], 'lint', ['run', 'lint:*'], []],
      [[], 'jest', ['jest'], ['--verbose']]
    ]);
  });


  it('matches script patterns', ()=> {
    const argv = ['lint:*'];

    const {tasks, dryRun, help} = parseArgs(argv, scripts);

    expect(help).toBe(false);
    expect(dryRun).toBe(false);
    expect([...tasks]).toEqual([
      [[], 'lint:md', ['remark', '--use', 'remark-lint', '*.md'], []],
      [[], 'lint:js', ['eslint', '.'], []]

    ]);
  });


  it('matches node-args for scripts', ()=> {
    const argv = ['--inspect-brk', 'jest', '--runInBand'];

    const {tasks, dryRun, help} = parseArgs(argv, scripts);

    expect(help).toBe(false);
    expect(dryRun).toBe(false);
    expect([...tasks]).toEqual([
      [['--inspect-brk'], 'jest', ['jest'], ['--runInBand']]
    ]);
  });
});
