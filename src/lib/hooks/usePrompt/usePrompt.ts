import { type NavigationActionType } from 'node_modules/@resourge/history-store/dist/index.js';

import { useBlocker } from '../useBlocker/useBlocker';
import { type Blocker, type BlockerResult } from '../useBlocker/useBlockerTypes';

export type UsePromptProps = {
	message?: ((currentUrl: URL, nextUrl: URL, action: NavigationActionType) => string) | string
	/**
	 * When true blocks url change
	 */
	when: Blocker<NavigationActionType> | boolean
};

/**
 * @param when When `true` it will prompt the user 
 * 	before navigating away from a screen. 
 *  (accepts method that return's boolean).
 * @param message When set, will prompt the user with native `confirm` and message.
 * 	When `undefined` will wait for `continueNavigation or finishBlocking` method to be called
 * @returns promptResult {BlockerResult}
 */
export const usePrompt = ({ message, when }: UsePromptProps): BlockerResult => {
	const _blocker = typeof when === 'boolean'
		? () => when
		: (when);

	return useBlocker((currentUrl, nextUrl, action) => {
		const isBlocking = _blocker(currentUrl, nextUrl, action);

		if ( isBlocking && message && action !== 'beforeunload' ) {
			const _message = typeof message === 'string'
				? message
				: message(currentUrl, nextUrl, action);

			return !globalThis.confirm(_message);
		}

		return isBlocking;
	});
};
