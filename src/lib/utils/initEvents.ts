/* eslint-disable no-restricted-globals */

export const popState = 'popstate'
export const pushState = 'pushState'
export const replaceState = 'replaceState'

export const events = [pushState, replaceState] as const;

export const initEvents = (): typeof events => {
	/**
	 * While History API does have `popstate` event, the only
	 * proper way to listen to changes via `push/replaceState`
	 * is to monkey-patch these methods.
	 * 
	 * @see https://stackoverflow.com/a/4585031
	 */
	if (typeof history !== 'undefined') {
		for (const type of [pushState, replaceState]) {
			const original = history[type];
		
			history[type] = function () {
				const result = original.apply(this, arguments);
				const event = new Event(type);
				// @ts-expect-error
				event.arguments = arguments;
		
				dispatchEvent(event);
				return result;
			};
		}
	}

	return events;
}
