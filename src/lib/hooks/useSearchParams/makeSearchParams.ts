import { type MutableRefObject, useRef, useSyncExternalStore } from 'react';

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

/**
 * Returns the current search parameters
 * @param defaultParams {T}
 */
export const makeSearchParams = (
	store: HistoryStoreType
) => {
	const notifications: Array<() => void> = [];

	const [url] = store.getValue();

	const state = {
		url
	};

	store.onUrlChange(({ url }) => {
		state.url = url;
		
		notifications.forEach((notification) => {
			notification();
		});
	});
	
	function subscribe(
		notification: () => void 
	) {
		notifications.push(notification);

		return () => {
			const index = notifications.indexOf(notification);
			if ( index > -1 ) {
				notifications.splice(index, 1);
			}
		};
	};

	const getSnapshot = <T extends Record<string, any>>(
		dataRef: MutableRefObject<{
			data: T
			search: string
		}>,
		hash: boolean, 
		defaultParams?: T
	) => {
		return (): T => {
			const _href = getHrefWhenHashOrNormal(state.url, hash);
			const _url = new URL(_href);

			if ( dataRef.current.search !== _url.search ) {
				dataRef.current.search = _url.search;
				dataRef.current.data = parseSearchParams(
					_url.searchParams, 
					defaultParams
				);
			}

			return dataRef.current.data;
		};
	};

	return <T extends Record<string, any>>(defaultParams?: T): T => {
		const { hash } = useRoute();
		const dataRef = useRef<{ data: T, search: string }>({
			search: '',
			data: (defaultParams ?? {}) as T
		});

		return useSyncExternalStore<T>(
			subscribe,
			getSnapshot(dataRef, hash, defaultParams),
			getSnapshot(dataRef, hash, defaultParams)
		);
	};
};
