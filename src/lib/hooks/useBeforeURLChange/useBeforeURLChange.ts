import { useEffect, useRef } from 'react';

import { type NavigationActionType, type BeforeUrlChangeEvent } from '@resourge/history-store';

/**
 * Fires before the route changes.
 * @param beforeURLChange
 *  If result:
 * 		`true` routing will occur normally
 *  	`false` will prevent route from changing
 */
export const useBeforeURLChange = (beforeURLChange: (url: URL, action: NavigationActionType, next: () => void) => boolean) => {
	const beforeURLChangeRef = useRef(beforeURLChange);

	beforeURLChangeRef.current = beforeURLChange;

	useEffect(() => {
		const _beforeURLChange = (event: BeforeUrlChangeEvent) => beforeURLChangeRef.current(event.url, event.action, event.next);
		window.addEventListener('beforeURLChange', _beforeURLChange, false);

		return () => {
			window.removeEventListener('beforeURLChange', _beforeURLChange, false);
		};
	}, []);
};
