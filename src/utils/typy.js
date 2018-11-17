
/* eslint-disable import/prefer-default-export */
const getNestedObject = (obj, dotSeparatedKeys) => {
	if (arguments.length > 1 && typeof dotSeparatedKeys !== 'string') return undefined;
	if (typeof obj !== 'undefined' && typeof dotSeparatedKeys === 'string') {
		const pathArr = dotSeparatedKeys.split('.');
		pathArr.forEach((key, idx, arr) => {
			if (typeof key === 'string' && key.includes('[')) {
				try {
					// extract the array index as string
					const pos = /\[([^)]+)\]/.exec(key)[1];
					// get the index string length (i.e. '21'.length === 2)
					const posLen = pos.length;
					arr.splice(idx + 1, 0, Number(pos));

					// keep the key (array name) without the index comprehension:
					// (i.e. key without [] (string of length 2)
					// and the length of the index (posLen))
					arr[idx] = key.slice(0, (-2 - posLen)); // eslint-disable-line no-param-reassign
				} catch (e) {
					// do nothing
				}
			}
		});
		// eslint-disable-next-line no-param-reassign, no-confusing-arrow
		obj = pathArr.reduce((o, key) => (o && o[key] !== 'undefined' ? o[key] : undefined), obj);
	}
	return obj;
};

class Typy {
	t = (obj, nestedKeys) => {
		this.input = obj;

		if (nestedKeys) {
			this.input = getNestedObject(this.input, nestedKeys);
		}

		return this;
	};

	get isDefined() {
		return (typeof this.input !== 'undefined');
	}

	get isUndefined() {
		return (typeof this.input === 'undefined');
	}

	get isNull() {
		return (this.input === null && typeof this.input === 'object');
	}

	get isNullOrUndefined() {
		return (this.isNull || this.isUndefined);
	}

	get isBoolean() {
		return (typeof this.input === typeof true);
	}

	get isTrue() {
		return (this.input === true);
	}

	get isFalse() {
		return (this.input === false);
	}

	get isTruthy() {
		return (this.input);
	}

	get isFalsy() {
		return (!this.input);
	}

	get isObject() {
		return (
			typeof this.input === 'object' &&
			this.input === Object(this.input) &&
			Object.prototype.toString.call(this.input) !== '[object Array]'
		);
	}

	get isEmptyObject() {
		return (this.isObject && Object.keys(this.input).length === 0);
	}

	get isString() {
		return (typeof this.input === 'string');
	}

	get isEmptyString() {
		return (this.isString && this.input.length === 0);
	}

	get isNumber() {
		return (Number.isFinite(this.input));
	}

	get isArray() {
		return (Array.isArray(this.input));
	}

	get isEmptyArray() {
		return (this.isArray && this.input.length === 0);
	}

	get isFunction() {
		return (typeof this.input === 'function');
	}

	get safeObject() {
		return this.input;
	}

	get safeString() {
		if (this.isString) return this.input;
		return '';
	}

	get safeNumber() {
		if (this.isNumber) return this.input;
		return 0;
	}

	get safeBoolean() {
		if (this.isBoolean) return this.input;
		return false;
	}

	get safeFunction() {
		if (this.isFunction) return this.input;
		return /* istanbul ignore next */ () => {};
	}
}

const t = (input, objectPath) => new Typy().t(input, objectPath);

export default t;