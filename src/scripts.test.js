import {join} from 'path';
import {getScripts} from './scripts';
import {loadModuleIfExists} from './modules';


jest.mock('./modules', ()=> ({
  loadModuleIfExists: jest.fn()
}));

const fs = {readdirSync: jest.fn()};


describe('getScripts()', ()=> {

  beforeEach(()=> {
    fs.readdirSync.mockImplementation(()=> []);
  });

  const pkgDir = 'test-dir';

  it('gets scripts from package.json', ()=> {
    loadModuleIfExists.mockReturnValueOnce({
      scripts: {
        test: 'pkg-test',
        lint: 'pkg-lint'
      }
    });

    const scripts = getScripts(pkgDir, fs);

    expect(loadModuleIfExists).toHaveBeenCalledWith(
      join(pkgDir, 'package.json')
    );
    expect(scripts).toEqual({
      test: 'pkg-test',
      lint: 'pkg-lint'
    });
  });


  it('gets scripts from scripts module, overwriting package.json', ()=> {
    loadModuleIfExists.mockReturnValueOnce({
      scripts: {
        test: 'pkg-test',
        lint: 'pkg-lint'
      }
    });
    loadModuleIfExists.mockReturnValueOnce({
      default: {
        test: 'scripts-module-test',
        build: 'scripts-module-build'
      }
    });

    const scripts = getScripts(pkgDir, fs);

    expect(loadModuleIfExists).toHaveBeenCalledWith(
      join(pkgDir, 'package.json')
    );
    expect(loadModuleIfExists).toHaveBeenCalledWith(join(pkgDir, 'scripts'));
    expect(scripts).toEqual({
      test: 'scripts-module-test',
      lint: 'pkg-lint',
      build: 'scripts-module-build'
    });
  });


  it('gets scripts from scripts/* modules overwriting scripts module', ()=> {
    loadModuleIfExists.mockReturnValueOnce({
      scripts: {
        test: 'pkg-test',
        lint: 'pkg-lint'
      }
    });
    loadModuleIfExists.mockReturnValueOnce({
      default: {
        test: 'scripts-module-test',
        lint: 'pkg-lint'
      }
    });
    fs.readdirSync.mockReturnValueOnce(['build.js']);

    const scripts = getScripts(pkgDir, fs);

    expect(loadModuleIfExists).toHaveBeenCalledWith(
      join(pkgDir, 'package.json')
    );
    expect(loadModuleIfExists).toHaveBeenCalledWith(join(pkgDir, 'scripts'));
    expect(scripts).toEqual({
      test: 'scripts-module-test',
      lint: 'pkg-lint',
      build: 'node -r npx-run/loaders ./scripts/build.js'
    });
  });


  it('ignores missing scripts object in package.json', ()=> {
    loadModuleIfExists.mockReturnValueOnce({});

    const scripts = getScripts(pkgDir, fs);

    expect(loadModuleIfExists).toHaveBeenCalledWith(
      join(pkgDir, 'package.json')
    );
    expect(scripts).toEqual({});
  });


  it('ignores missing scripts module dir', ()=> {
    fs.readdirSync.mockImplementation(()=> throw new Error('no such file'));

    expect(getScripts(pkgDir, fs)).toEqual({});
  });


  it('ignores index.js in scripts dir', ()=> {
    fs.readdirSync.mockReturnValueOnce(['index.js', 'build.js']);

    expect(getScripts(pkgDir, fs)).toEqual({
      build: 'node -r npx-run/loaders ./scripts/build.js'
    });
  });
});
