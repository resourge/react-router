import { useEffect, useRef, useState } from 'react';

import { HistoryContextObject, RouteHistory } from '../contexts/HistoryContext';
import { RouteLocation } from '../contexts/LocationContext';
import { createHistory } from '../utils/createHistory';

export type RouterConfig = {
	/**
	 * History system
	 */
	history?: RouteHistory
	/**
	 * Initial Location
	 */
	location?: RouteLocation
}

/**
 * Returns History and Location context to initial Router system
 */
export const useRouter = (
	{
		history, 
		location
	}: RouterConfig
) => {
	const ref = useRef<HistoryContextObject>();
	if ( !ref.current ) {
		ref.current = { history: history ?? createHistory(location) }
	}

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const [locationContext, setLocationContext] = useState(() => ref.current!.history.location)

	useEffect(() => {
		const unmount = ref.current?.history.listen((_, location) => {
			setLocationContext(location)
		})

		return () => unmount && unmount();
	}, [])

	const historyContext = ref.current;

	return {
		historyContext,
		locationContext
	}
}
