import {print} from './strings';
import {process} from './globals';


jest.mock('./globals', ()=> ({
  process: {
    stdout: {write: jest.fn()}
  }
}));


describe('print`...`', ()=> {
  it('prints single line', ()=> {
    print`  foobar`;

    expect(process.stdout.write).toHaveBeenCalledWith('  foobar\n');
  });


  it('prints multiple lines with outdentation', ()=> {
    print`
      foobar
        spam
        ham
    `;

    expect(process.stdout.write).toHaveBeenCalledWith(
      [
        'foobar',
        '  spam',
        '  ham',
        '\n'
      ].join('\n')
    );
  });


  it('prints array items as space separated list', ()=> {
    print`${[1, 2, 'foo']}`;

    expect(process.stdout.write).toHaveBeenCalledWith('1 2 foo\n');
  });


  it('prints strings and other items as is', ()=> {
    print`${'foo'} ${123}`;

    expect(process.stdout.write).toHaveBeenCalledWith('foo 123\n');
  });
});
