import { useEffect, useRef } from 'react';

import { type BeforeUrlChangeEvent } from '@resourge/react-search-params';

/**
 * Fires before the route changes.
 * @param beforeURLChange
 *  If result:
 * 		`true` routing will occur normally
 *  	`false` will prevent route from changing
 */
export const useBeforeURLChange = (beforeURLChange: (event: BeforeUrlChangeEvent) => boolean) => {
	const beforeURLChangeRef = useRef(beforeURLChange);

	beforeURLChangeRef.current = beforeURLChange;

	useEffect(() => {
		const _beforeURLChange = (event: BeforeUrlChangeEvent) => beforeURLChangeRef.current(event);
		window.addEventListener('beforeURLChange', _beforeURLChange, false);

		return () => {
			window.removeEventListener('beforeURLChange', _beforeURLChange, false);
		};
	}, []);
};
