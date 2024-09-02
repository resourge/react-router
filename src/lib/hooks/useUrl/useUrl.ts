import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useSyncExternalStore
} from 'react';

import { HistoryStore } from '@resourge/history-store';

/**
 * Returns the current {@link URL} object.
 * @returns {URL}, {@link EventType}
 */
export const useUrl = () => {
	// This is because URLChange trigger before useSyncExternalStore `unsubscribe`
	const unsubscribeRef = useRef(() => {});
	useEffect(() => () => {
		unsubscribeRef.current(); 
	}, []);
	const [url, action, previousValue] = useSyncExternalStore(
		useCallback((notification) => {
			unsubscribeRef.current = HistoryStore.subscribe(notification);
			return () => {};
		}, []),
		() => HistoryStore.getValue(),
		() => HistoryStore.getValue()
	);

	return useMemo(
		() => ({
			url,
			action,
			previousUrl: previousValue ? previousValue[0] : undefined,
			previousAction: previousValue ? previousValue[1] : undefined
		}), 
		[url, action, previousValue]
	);
};
