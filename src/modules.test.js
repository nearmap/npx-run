import {loadModuleIfExists} from './modules';

const virtual = true;


describe('loadIfModuleExists()', ()=> {

  it('returns loaded module', ()=> {
    jest.doMock('./test-module', ()=> 'test', {virtual});

    expect(loadModuleIfExists('./test-module')).toBe('test');
  });

  it('returns undefined if module does not exist', ()=> {
    expect(loadModuleIfExists('./module-does-not-exist')).toBe(undefined);
  });

  it('throws when module has errors', ()=> {
    jest.doMock('./error-module', ()=> throw new Error('testing'), {virtual});

    expect(()=> loadModuleIfExists('./error-module')).toThrow('testing');
  });
});
