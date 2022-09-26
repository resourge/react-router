import { useState } from 'react';

import { EVENTS } from '@resourge/react-search-params';

import { useRoute } from '../contexts/RouteContext';

import { useBeforeURLChange } from './useBeforeURLChange';

export type Blocker = (routeUrl: URL, url: URL, action: typeof EVENTS[keyof typeof EVENTS]) => boolean

/**
 * Fires before the route change, and serves to block or not the current route.
 * @param blocker {Blocker}
 * @returns [0] true/false for if it is blocking
 * 			[1] Method that is going to call the original navigation
 */
export const useBlocker = (
	blocker: Blocker
): [boolean, () => void] => {
	const { url } = useRoute();
	const [{ isBlocking, next }, setNext] = useState<{ isBlocking: boolean, next: () => void }>({
		isBlocking: false,
		next: () => {}
	})

	useBeforeURLChange((event) => {
		const next = () => {
			event.next();
			setNext({
				isBlocking: false,
				next: () => {}
			})
		}
		const isBlocking = blocker(url, event.url, event.action);

		if ( isBlocking ) {
			setNext({
				isBlocking: true,
				next
			})
		}
		return !isBlocking
	})

	return [isBlocking, next];
}
