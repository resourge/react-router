import { useEffect, useRef } from 'react';

import { History, type NavigationActionType } from '@resourge/history-store/mobile';

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
		return History.addEventListener('beforeURLChange', (current, next) => beforeURLChangeRef.current(current.url, current.action, next));
	}, []);
};
