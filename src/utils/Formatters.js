export function sortObjKeysAlphabetically(obj) {
	let ordered = {};
	Object.keys(obj).sort().forEach(function (key) {
		ordered[key] = obj[key];
	});
	return ordered;
}