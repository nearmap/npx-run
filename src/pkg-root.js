import fs from 'fs';
import {join, dirname} from 'path';
import {process} from './globals';


const isPackageDir = (dir)=> fs.existsSync(join(dir, 'package.json'));


const findPackageDir = (dir=process.cwd())=> {
  if (isPackageDir(dir)) {
    return dir;
  }

  const parentDir = dirname(dir);

  if (parentDir === dir) {
    return;
  }

  return findPackageDir(parentDir);
};

export default findPackageDir;
