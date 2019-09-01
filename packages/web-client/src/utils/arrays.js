export const interpolateEmptyItems = (collectionWithEmptyItems, emptyElementSample = null, simpleComparator) => {
  let comparator = simpleComparator;

  if (!simpleComparator) {
    comparator = (item, itemEmptyElementSample) => item === itemEmptyElementSample;
  }

  return collectionWithEmptyItems.map((item, idx, arr) => {
    if (!comparator(item, emptyElementSample)) {
      return item;
    }

    const nextCollection = arr.slice(idx);
    const prevCollection = arr.slice(0, idx + 1).reverse();

    const nextNonEmptyIdx = nextCollection.findIndex(innerItem => !comparator(innerItem, emptyElementSample));
    const prevNonEmptyIdx = prevCollection.findIndex(innerItem => !comparator(innerItem, emptyElementSample));

    // If negative meaning the extremes of the initial array are already empty
    if (prevNonEmptyIdx < 0) {
      return nextCollection[nextNonEmptyIdx];
    }

    // If negative meaning the extremes of the initial array are already empty
    if (nextNonEmptyIdx < 0) {
      return prevCollection[prevNonEmptyIdx];
    }

    // If distance is equal or closer than prev element then return prev non empty
    if (prevNonEmptyIdx <= nextNonEmptyIdx) {
      return prevCollection[prevNonEmptyIdx];
    }

    // If distance is closer than next element then return next non empty
    if (nextNonEmptyIdx < prevNonEmptyIdx) {
      return nextCollection[nextNonEmptyIdx];
    }

    return item;
  });
};
