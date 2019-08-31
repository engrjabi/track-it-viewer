import _orderBy from "lodash/orderBy";
import moment from "moment";

export function sortObjKeysAlphabetically(obj) {
  let ordered = {};
  Object.keys(obj)
    .sort()
    .forEach(function(key) {
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

export const sortByTime = (collection, path, timeFormat, direction = "asc") => {
  return _orderBy(
    collection,
    function(o) {
      return new moment(o[path], timeFormat);
    },
    [direction]
  );
};

export const sortByDate = (collection, path, dateFormat, direction = "asc") => {
  return _orderBy(
    collection,
    function(o) {
      return new moment(o[path], dateFormat);
    },
    [direction]
  );
};

export function prettyFormatMinTime(n) {
  const hours = n / 60;
  const rHours = Math.floor(hours);
  const minutes = (hours - rHours) * 60;
  const rMinutes = Math.round(minutes);
  return rHours + " hour(s) and " + rMinutes + " minute(s).";
}
