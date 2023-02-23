import { useState } from 'react';

import { type EVENTS } from '@resourge/react-search-params';

import { useRoute } from '../contexts/RouteContext';

import { useBeforeURLChange } from './useBeforeURLChange';

export type Blocker = (routeUrl: URL, url: URL, action: typeof EVENTS[keyof typeof EVENTS]) => boolean

export type BlockerResult = {
	continueNavigation: () => void
	finishBlocking: () => void
	isBlocking: boolean
}

/**
 * Fires before the route change, and serves to block or not the current route.
 * @param blocker {Blocker}
 * @returns blockerResult {BlockerResult}
 */
export const useBlocker = (
	blocker: Blocker
): BlockerResult => {
	const { url } = useRoute();
	const [{ isBlocking, continueNavigation }, setBlocker] = useState<{ continueNavigation: () => void, isBlocking: boolean }>({
		isBlocking: false,
		continueNavigation: () => {}
	})

	const finishBlocking = () => {
		setBlocker({
			isBlocking: false,
			continueNavigation: () => {}
		})
	}

	useBeforeURLChange((event) => {
		const continueNavigation = () => {
			event.next();
			finishBlocking();
		}
		const isBlocking = blocker(url, event.url, event.action);
		
		if ( isBlocking ) {
			setBlocker({
				isBlocking: event.action !== 'beforeunload',
				continueNavigation
			})
		}
		return !isBlocking
	})

	return {
		isBlocking, 
		continueNavigation, 
		finishBlocking
	};
}
