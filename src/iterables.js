
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
