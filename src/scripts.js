import {join, basename} from 'path';
import {loadModuleIfExists} from './modules';


const loadPkgModule = (pkgDir, path)=> (
  loadModuleIfExists(join(pkgDir, path)) || {}
);


const getPkgScripts = (pkgDir)=> (
  loadPkgModule(pkgDir, 'package.json').scripts || {}
);


const getScriptsModuleScripts = (pkgDir)=> (
  loadPkgModule(pkgDir, 'scripts').default || {}
);


const listScriptFiles = (pkgDir, fs)=> {
  try {
    return fs.readdirSync(join(pkgDir, 'scripts'));
  } catch {
    // we ignore if there is no scripts dir containing modules
    return [];
  }
};


const getScriptsDirScripts = (pkgDir, fs)=> {
  const scripts = {};

  for (const fileName of listScriptFiles(pkgDir, fs)) {
    const name = basename(fileName, '.js');

    if (name !== 'index') {
      scripts[name] = `node -r npx-run/loaders ./scripts/${fileName}`;
    }
  }
  return scripts;
};


export const getScripts = (pkgDir, fs)=> ({
  ...getPkgScripts(pkgDir),
  ...getScriptsModuleScripts(pkgDir),
  ...getScriptsDirScripts(pkgDir, fs)
});
