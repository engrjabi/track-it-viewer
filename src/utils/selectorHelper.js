import { createSelector } from 'reselect';

export const singleSelectorsCreation = (objectsOfSelectors) => {
	let singleSelectorCollection = { ...objectsOfSelectors };

	for (let selector in singleSelectorCollection) {
		if (singleSelectorCollection.hasOwnProperty(selector)) {
			let currentSelector = singleSelectorCollection[selector];
			currentSelector = createSelector(
				[currentSelector],
				(singleParameter) => (singleParameter)
			);
		}
	}

	return singleSelectorCollection;
};