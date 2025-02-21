import { useState } from 'react';

import { type NavigationActionType as RNavigationActionType } from '@resourge/history-store/dist/types/navigationActionType/NavigationActionType';
import { type NavigationActionType as RNNavigationActionType } from '@resourge/history-store/dist/types/navigationActionType/NavigationActionType.native';

import { useRouter } from '../../contexts/RouterContext';

import { type Blocker, type BlockerResult } from './useBlockerTypes';

type NavigationActionType = RNavigationActionType | RNNavigationActionType;

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
		const [{ isBlocking, continueNavigation }, setBlocker] = useState<{ continueNavigation: () => void, isBlocking: boolean }>({
			isBlocking: false,
			continueNavigation: () => {}
		});

		const finishBlocking = () => {
			setBlocker({
				isBlocking: false,
				continueNavigation: () => {}
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
					isBlocking: action !== 'beforeunload',
					continueNavigation
				});
			}
			return !isBlocking;
		});

		return {
			isBlocking, 
			continueNavigation, 
			finishBlocking
		};
	};
	return useBlocker;
}
