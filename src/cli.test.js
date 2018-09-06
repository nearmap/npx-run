import run from '.';
import {main} from './cli';


jest.mock('.', ()=> jest.fn(()=> -123));


describe('main()', ()=> {
  it('calls the run function on startup', async ()=> {
    const process = {
      argv: ['ignored-1', 'ignored-2', 'test', 'arg'],
      exit: jest.fn()
    };

    await main(process);

    expect(run).toHaveBeenCalledWith('test', 'arg');
    expect(process.exit).toHaveBeenCalledWith(-123);
  });
});
