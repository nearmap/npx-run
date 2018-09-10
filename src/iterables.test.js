import {groups, headTail} from './iterables';


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


describe('headTail()', ()=> {
  function* testItems() {
    yield 1;
    yield 2;
    yield 3;
    throw new Error('Generator should not e exhausted.');
  }

  it('splits an iterable into head-item and tail-generator', ()=> {
    const [item1, [item2, item3]] = headTail(testItems());

    expect([item1, item2, item3]).toEqual([1, 2, 3]);
  });

  it('returns undefiend for first item if iterable is empty', ()=> {
    const [item1, [item2, item3]] = headTail([]);

    expect([item1, item2, item3]).toEqual([undefined, undefined, undefined]);
  });
});
