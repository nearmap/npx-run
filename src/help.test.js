import {process} from './globals';
import {showHelp, scriptCompare} from './help';


jest.mock('chalk', ()=> (parts, ...args)=> String.raw({raw: parts}, ...args));

jest.mock('./globals', ()=> ({
  process: {
    stdout: {write: jest.fn()}
  }
}));


const getStdoutData = ()=> (
  process.stdout.write.mock.calls.map(([data])=> data).join('')
);


describe('showHelp', ()=> {
  it('prints help for missing scripts', ()=> {
    const scripts = {};

    showHelp(scripts);

    expect(getStdoutData()).toMatchSnapshot();
  });


  it('prints help with list of scripts', ()=> {
    const scripts = {
      test: 'echo "Works on my machine!"',
      clean: 'rimraf ./build',
      default: 'run clean test',
      'create-pkg-json': 'echo "done"',
      dry: 'run --dry-run clean --verbose'
    };

    showHelp(scripts);

    expect(getStdoutData()).toMatchSnapshot();
  });
});


describe('scriptCompare', ()=> {
  it('sorts', ()=> {
    const items = ['default', 'a', 'b', 'a', 'default', 'c'];
    expect([...items].sort(scriptCompare)).toEqual([
      'default', 'default', 'a', 'a', 'b', 'c'
    ]);
  });
});
