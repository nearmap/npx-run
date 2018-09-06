import {getScripts} from './scripts';


const mockModules = (testDir, modules)=> {
  const virtual = true;
  const moduleRoot = `${__dirname}/${testDir}`;

  for (const [modName, modFac] of modules) {
    jest.doMock(`${moduleRoot}/${modName}`, modFac, {virtual});
  }
  return moduleRoot;
};


const fs = {
  readdirSync: jest.fn()
};


describe('getScripts()', ()=> {

  beforeEach(()=> {
    fs.readdirSync.mockImplementation(()=> []);
  });


  it('gets scripts from package.json', ()=> {
    const pkgDir = mockModules(
      'package-json-only-dir', [
        ['package.json', ()=> ({
          scripts: {
            test: 'pkg-test',
            lint: 'pkg-lint'
          }
        })
        ]]
    );

    expect(getScripts(pkgDir, fs)).toEqual({
      test: 'pkg-test',
      lint: 'pkg-lint'
    });
  });


  it('gets scripts from scripts module, overwriting package.json', ()=> {
    const pkgDir = mockModules('with-scripts-module-dir', [
      ['package.json', ()=> ({
        scripts: {
          test: 'pkg-test',
          lint: 'pkg-lint'
        }
      })
      ],
      ['scripts', ()=> ({
        test: 'scripts-module-test',
        build: 'scripts-module-build'
      })
      ]
    ]);

    expect(getScripts(pkgDir, fs)).toEqual({
      test: 'scripts-module-test',
      lint: 'pkg-lint',
      build: 'scripts-module-build'
    });
  });


  it('gets scripts from scripts/* modules overwriting scripts module', ()=> {
    const pkgDir = mockModules('with-scripts-module-and-scripts-dir', [
      ['package.json', ()=> ({
        scripts: {
          test: 'pkg-test',
          lint: 'pkg-lint'
        }
      })
      ],
      ['scripts', ()=> ({
        test: 'scripts-module-test',
        build: 'scripts-module-build'
      })
      ]
    ]);
    fs.readdirSync.mockReturnValueOnce(['build.js']);

    expect(getScripts(pkgDir, fs)).toEqual({
      test: 'scripts-module-test',
      lint: 'pkg-lint',
      build: 'node -r @babel/register ./scripts/build.js'
    });
  });


  it('throws when script module has errors', ()=> {
    const pkgDir = mockModules('failing-scripts-module-dir', [
      ['scripts', ()=> throw new Error('scripts-module-err')]
    ]);

    expect(()=> getScripts(pkgDir, fs)).toThrow('scripts-module-err');
  });


  it('throws when package.json module has errors', ()=> {
    const pkgDir = mockModules('failing-package-json-dir', [
      ['package.json', ()=> throw new Error('pkg-json-err')]
    ]);

    expect(()=> getScripts(pkgDir, fs)).toThrow('pkg-json-err');
  });


  it('ignores missing scripts object in package.json', ()=> {
    const pkgDir = mockModules('missing-package-json-scripts-object-dir', [
      ['package.json', ()=> ({})]
    ]);

    expect(getScripts(pkgDir, fs)).toEqual({});
  });


  it('ignores non-js scripts', ()=> {
    const pkgDir = mockModules('ignored-scripts', []);
    fs.readdirSync.mockReturnValueOnce(['build.js', 'ignored.txt']);

    expect(getScripts(pkgDir, fs)).toEqual({
      build: 'node -r @babel/register ./scripts/build.js'
    });
  });
});
