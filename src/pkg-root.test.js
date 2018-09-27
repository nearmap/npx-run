import {resolve} from 'path';
import {process} from './globals';
import findPackageDir from './pkg-root';


jest.mock('./globals', ()=> ({
  process: {
    cwd: jest.fn(()=> '/tmp/test-dir')
  }
}));


describe('findPackageDir()', ()=> {
  it('uses process.cwd() as default start dir', ()=> {
    const result = findPackageDir();

    expect(process.cwd).toHaveBeenCalledWith();
    expect(result).toBe(undefined);
  });

  it('finds package directory in parent dirs', ()=> {
    const result = findPackageDir(__dirname);

    expect(process.cwd).not.toHaveBeenCalled();
    expect(result).toBe(resolve(__dirname, '..'));
  });
});
