import { useEffect, useRef } from 'react';

import { BeforeRouteChange } from '../contexts/HistoryContext';

import { useHistory } from './useHistory';

/**
 * Fires before the route change.
 * @param cb
 *  If result:
 * 		`true` routing will occur normally
 *  	`false` will prevent route from changing
 *  	`"location"` will route to new location instead
 */
export const useBeforeRouteChange = (cb: BeforeRouteChange) => {
	const history = useHistory();
	const cbRef = useRef<BeforeRouteChange>(cb);

	cbRef.current = cb;

	useEffect(() => {
		const unmount = history.beforeRouteChange(cbRef.current)

		return () => unmount()
	}, [history])
}
