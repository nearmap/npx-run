
export function* groups(items, split) {
  let collected = [];

  for (const item of items) {
    if (split(item)) {
      yield collected;
      collected = [];
    }
    collected.push(item);
  }

  if (collected.length) {
    yield collected;
  }
}


export function* headTail(iterable) {
  const iter = iterable[Symbol.iterator]();
  const {value} = iter.next();
  yield value;
  yield iter;
}
