import {loadModuleIfExists} from './modules';


jest.mock('./modules', ()=> ({
  loadModuleIfExists: jest.fn()
}));


describe('loaders', ()=> {
  it('it tries loading @babel/register', ()=> {
    require('./loaders');

    expect(loadModuleIfExists).toHaveBeenCalledWith('@babel/register');
  });
});
