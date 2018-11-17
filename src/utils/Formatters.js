export function sortObjKeysAlphabetically(obj) {
	let ordered = {};
	Object.keys(obj).sort().forEach(function (key) {
		ordered[key] = obj[key];
	});
	return ordered;
}

export const sortAlphabetically = propertyName => {
  return (a, b) => {
    const nameA = a[propertyName].toUpperCase(); // ignore upper and lowercase
    const nameB = b[propertyName].toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  };
};