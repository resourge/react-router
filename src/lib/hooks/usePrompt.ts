import { type ActionType } from '@resourge/react-search-params'

import { useBlocker, type Blocker, type BlockerResult } from './useBlocker'

export type UsePromptProps = {
	/**
	 * When true blocks url change
	 */
	when: boolean | Blocker
	message?: string | ((currentUrl: URL, nextUrl: URL, action: ActionType) => string)
}

/**
 * @param when When `true` it will prompt the user 
 * 	before navigating away from a screen. 
 *  (accepts method that return's boolean).
 * @param message When set, will prompt the user with native `confirm` and message.
 * 	When `undefined` will wait `[1]` method to be called
 * @returns promptResult {BlockerResult}
 */
export const usePrompt = ({ when, message }: UsePromptProps): BlockerResult => {
	const _blocker = typeof when === 'boolean' ? () => when : (when)

	return useBlocker((currentUrl, nextUrl, action) => {
		const isBlocking = _blocker(currentUrl, nextUrl, action);

		if ( isBlocking && message && action !== 'beforeunload' ) {
			const _message = typeof message === 'string' ? message : message(currentUrl, nextUrl, action)

			return !window.confirm(_message)
		}

		return isBlocking;
	})
}
