import {showHelp} from './help';


let mockStdout = '';

jest.mock('./globals', ()=> ({
  process: {
    stdout: {
      write(data) {
        mockStdout += data;
      }
    }
  }
}));


describe('showHelp', ()=> {
  beforeEach(()=> {
    mockStdout = '';
  });


  it('prints help for missing scripts', ()=> {
    const scripts = {};

    showHelp(scripts);

    expect(mockStdout).toMatchSnapshot();
  });


  it('prints help with list of scripts', ()=> {
    const scripts = {
      test: 'echo "Works on my machine!"'
    };

    showHelp(scripts);

    expect(mockStdout).toMatchSnapshot();
  });
});
