import {showHelp, scriptCompare} from './help';


let mockStdout = '';

jest.mock('./globals', ()=> ({
  process: {
    stdout: {
      write(data) {
        mockStdout += data;
      }
    }
  }
}));


describe('showHelp', ()=> {
  beforeEach(()=> {
    mockStdout = '';
  });


  it('prints help for missing scripts', ()=> {
    const scripts = {};

    showHelp(scripts);

    expect(mockStdout).toMatchSnapshot();
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

    expect(mockStdout).toMatchSnapshot();
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
