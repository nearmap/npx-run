import {process} from './globals';


describe('globals', ()=> {

  it('exports process', ()=> {
    expect(process).toBe(global.process);
  });
});
