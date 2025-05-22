import { useCallback, useSyncExternalStore } from 'react';

import { parseSearchParams } from '@resourge/history-store/utils';

import { getHrefWhenHashOrNormal } from 'src/lib/utils/utils';

import { useRoute } from '../../contexts/RouteContext';

type HistoryStoreType = {
	getValue: () => [
		url: URL,
		action: any,
		previousValue?: any
	]
	onUrlChange: (cb: (state: { url: URL }) => void) => () => void
};

function SearchParamsHistory() {
	const notifications: Array<() => void> = [];

	const state = {
		data: {}
	};

	let remove: () => void = () => {};

	function setSearchParams<T extends Record<string, any>>(url: URL, hash: boolean, defaultParams?: T) {
		const _href = getHrefWhenHashOrNormal(url, hash);
		const searchParams = new URL(_href).searchParams;

		state.data = parseSearchParams(searchParams, defaultParams);
	}

	function subscribe<T extends Record<string, any>>(
		store: HistoryStoreType,
		notification: () => void, 
		hash: boolean, 
		defaultParams?: T
	) {
		notifications.push(notification);

		if ( notifications.length === 1 ) {
			const [url] = store.getValue();
			setSearchParams(url, hash, defaultParams);

			remove = store.onUrlChange(({ url }) => {
				setSearchParams(url, hash, defaultParams);
				
				notifications.forEach((notification) => {
					notification();
				});
			});
		}

		return () => {
			const index = notifications.indexOf(notification);
			if ( index > -1 ) {
				notifications.splice(index, 1);
			}
			if ( notifications.length === 0 ) { 
				remove();
			}
		};
	};

	const getSnapshot = () => state.data;

	return {
		getSnapshot,
		subscribe
	};
}

const SearchParamsStore = SearchParamsHistory();

/**
 * Returns the current search parameters
 * @param defaultParams {T}
 */
export const useBaseSearchParams = <T extends Record<string, any>>(
	store: HistoryStoreType,
	defaultParams?: T
) => {
	const { hash } = useRoute();

	return useSyncExternalStore(
		useCallback((notification) => {
			return SearchParamsStore.subscribe(store, notification, hash, defaultParams);
		}, [hash]),
		() => SearchParamsStore.getSnapshot(),
		() => SearchParamsStore.getSnapshot()
	);
};
