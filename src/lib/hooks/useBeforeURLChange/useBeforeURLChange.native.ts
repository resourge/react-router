import { useEffect, useRef } from 'react';

import { type ActionType, BeforeUrlChangeEvent } from '@resourge/react-search-params';

import { History } from 'src/lib/utils/createHistory/createHistory.native';

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

		const { remove } = History.addEventListener('beforeURLChange', (current, _, next) => {
			return _beforeURLChange(new BeforeUrlChangeEvent(current.action as ActionType, current.url, next));
		});

		return remove;
	}, []);
};
