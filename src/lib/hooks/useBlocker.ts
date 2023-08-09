import { useState } from 'react';

import { type ActionType } from '@resourge/react-search-params';

import { useRouter } from '../contexts';

import { useBeforeURLChange } from './useBeforeURLChange';

export type Blocker = (currentUrl: URL, nextUrl: URL, action: ActionType) => boolean

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
	const { url } = useRouter();
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
