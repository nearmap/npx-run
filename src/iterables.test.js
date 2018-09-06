import {groups} from './iterables';


describe('*groups()', ()=> {
  it('yields groups', ()=> {
    const items = [12, 34, 'split1', 56, 'split2', 78, 90];
    const groupOnFirstString = (item)=> typeof item === 'string';

    expect(
      [...groups(items, groupOnFirstString)]
    ).toEqual(
      [[12, 34], ['split1', 56], ['split2', 78, 90]]
    );
  });


  it('yields no groups if there are no items', ()=> {
    const items = [];

    expect(
      [...groups(items, ()=> true)]
    ).toEqual(
      []
    );
  });
});
