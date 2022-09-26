import { EVENTS } from '@resourge/react-search-params'

import { useBlocker, Blocker } from './useBlocker'

export type UsePromptProps = {
	/**
	 * When true blocks url change
	 */
	when: boolean | Blocker
	message?: string | ((routeUrl: URL, url: URL, action: typeof EVENTS[keyof typeof EVENTS]) => string)
}

/**
 * @param when When `true` it will prompt the user 
 * 	before navigating away from a screen. 
 *  (accepts method that return's boolean).
 * @param message When set, will prompt the user with native `confirm` and message.
 * 	When `undefined` will wait `[1]` method to be called
 * @returns [0] true/false for if it is blocking
 * 			[1] Method that call's the original navigation
 */
export const usePrompt = ({ when, message }: UsePromptProps): [boolean, () => void] => {
	const _blocker = typeof when === 'boolean' ? () => when : (when)

	const [isBlocking, next] = useBlocker((routeUrl, url, action) => {
		const isBlocking = _blocker(routeUrl, url, action);

		if ( isBlocking && message ) {
			const _message = typeof message === 'string' ? message : message(routeUrl, url, action)

			return !window.confirm(_message)
		}

		return isBlocking;
	})

	return [isBlocking, next]
}
