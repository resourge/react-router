/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-restricted-globals */

import { useEffect, useRef, useState } from 'react';

import { RouteLocation } from '../contexts/LocationContext';

import { useBeforeRouteChange } from './useBeforeRouteChange';
import { useLocation } from './useLocation';

export type PromptWhen = boolean | ((currentLocation: RouteLocation, nextLocation?: RouteLocation) => boolean | Promise<boolean>)

export type PromptMessage = string | ((currentLocation: RouteLocation, nextLocation?: RouteLocation) => string)

type State = {
	showChildren: boolean
	navigate?: () => void
}

/**
 * @param when When `true` it will prompt the user 
 * 	before navigating away from a screen. 
 *  (accepts method that return's either boolean or promise boolean).
 * @param message When set, will prompt the user with native `confirm` and message.
 * 	When `undefined` will show `children` and either wait `when` to be `false` 
 *  or the `[1]` method to be called
 * @returns [0] Boolean to show or not show children
 * 			[1] Method that call's the original navigation
 */
export const usePrompt = (
	when: PromptWhen,
	message?: PromptMessage
) => {
	const location = useLocation();
	const [
		{
			showChildren,
			navigate: next
		}, 
		setShowChildren
	] = useState<State>({
		showChildren: false
	});
	const whenRef = useRef(when)
	whenRef.current = when;

	useBeforeRouteChange(async (currentLocation, nextLocation, next) => {
		const when = typeof whenRef.current === 'function' ? (await Promise.resolve(whenRef.current(currentLocation, nextLocation))) : whenRef.current
		if ( when ) {
			if ( message ) {
				const _message = typeof message === 'function' ? message(currentLocation, nextLocation) : message
			
				return confirm(_message);
			}
			setShowChildren({
				showChildren: true,
				navigate: next
			})
			return false;
		}
		if ( showChildren ) {
			setShowChildren({
				showChildren: false
			})
		}
		return true
	});

	useEffect(() => {
		if ( showChildren ) {
			setShowChildren({
				showChildren: false
			})
			next && next() 
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [when, location.path])

	return [
		showChildren, 
		() => {
			whenRef.current = false;
			next && next() 
		}
	] as const;
}
