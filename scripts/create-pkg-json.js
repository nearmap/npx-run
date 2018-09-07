import fs from 'fs';
import {join} from 'path';

/**
 * Copy the existing `package.json` to the directory given by the
 * command line `argv`, replacing the name with `npx-run` and
 * making it not `private`.
 *
 * We use a dev name at the root of the repo so that we can install and
 * use `npx-run` as a dev dependency. When we build the package we need
 * to replace the name with the correct one to be used for publishing.
 */
export const main = ({argv}, {writeFileSync})=> {
  const [, , outDir] = argv;
  const outFileName = join(outDir, 'package.json');

  const pkg = require('../package.json');

  const newPkg = {...pkg, name: 'npx-run', private: false};

  const json = JSON.stringify(newPkg, null, 4);

  // eslint-disable-next-line no-console
  console.log(`writing ${outFileName}`);
  writeFileSync(outFileName, json);
};

/* istanbul ignore if */
if (require.main === module) {
  main(process, fs);
}
