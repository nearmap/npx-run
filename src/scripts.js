import {join, extname, basename} from 'path';


const loadPkgModule = (pkgDir, path)=> {
  try {
    return require(join(pkgDir, path));
  } catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
      throw err;
    }
  }

  return {};
};


const getPkgScripts = (pkgDir)=> (
  loadPkgModule(pkgDir, 'package.json').scripts || {}
);


const getScriptsModuleScripts = (pkgDir)=> (
  loadPkgModule(pkgDir, 'scripts')
);


const getScriptsDirScripts = (pkgDir, fs)=> {
  const scripts = {};

  const files = fs.readdirSync(join(pkgDir, 'scripts'));
  for (const fileName of files) {
    const name = basename(fileName, '.js');

    if (extname(fileName) === '.js' && name !== 'index') {
      // TODO: make @babel/register optional
      scripts[name] = `node -r @babel/register ./scripts/${fileName}`;
    }
  }
  return scripts;
};


export const getScripts = (pkgDir, fs)=> ({
  ...getPkgScripts(pkgDir),
  ...getScriptsModuleScripts(pkgDir),
  ...getScriptsDirScripts(pkgDir, fs)
});
