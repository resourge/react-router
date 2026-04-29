import { useState } from 'react';

import { NavigationActionType } from 'src/lib/types/NavigationActionType';

import { useRouter } from '../../contexts/RouterContext';

import { type Blocker, type BlockerResult } from './useBlockerTypes';

/**
 * Creates a custom hook to block or allow route changes based on a blocker function.
 * @param useBeforeURLChange - Hook to handle the before URL change event.
 * @returns A custom hook that provides blocking state and functions to control navigation.
 */
export function makeBlocker<T extends NavigationActionType>(
	useBeforeURLChange: (beforeURLChange: (url: URL, action: T, next: () => void) => boolean) => void
) {
	const useBlocker = (blocker: Blocker<T>): BlockerResult => {
		const { url } = useRouter();
		const [{ continueNavigation, isBlocking }, setBlocker] = useState<{ continueNavigation: () => void
			isBlocking: boolean }>({
			continueNavigation: () => {},
			isBlocking: false
		});

		const finishBlocking = () => {
			setBlocker({
				continueNavigation: () => {},
				isBlocking: false
			});
		};

		useBeforeURLChange((nextUrl, action, next) => {
			const continueNavigation = () => {
				next();
				finishBlocking();
			};
			const isBlocking = blocker(url, nextUrl, action);
		
			if ( isBlocking ) {
				setBlocker({
					continueNavigation,
					isBlocking: action !== 'beforeunload'
				});
			}
			return !isBlocking;
		});

		return {
			continueNavigation, 
			finishBlocking, 
			isBlocking
		};
	};
	return useBlocker;
}
