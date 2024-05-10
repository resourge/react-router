import { useEffect, useState } from 'react';

import { type UrlChangeEvent, parseSearchParams } from '@resourge/react-search-params';

import { useRoute } from '../contexts/RouteContext';
import { getHrefWhenHashOrNormal } from '../utils/utils';

/**
 * Returns the current search parameters
 * @param defaultParams {T}
 */
export const useSearchParams = <T extends Record<string, any>>(defaultParams?: T) => {
	const { search, hash } = useRoute();

	const [searchParams, setSearchParams] = useState(() => {
		const searchParams = new URLSearchParams(search ? `?${search}` : '');

		return parseSearchParams<T>(searchParams, defaultParams);
	});

	useEffect(() => {
		const onUrlChange = (e: UrlChangeEvent) => {
			const _href = getHrefWhenHashOrNormal(new URL(e.url), hash);

			const searchParams = new URL(_href).searchParams;

			setSearchParams(parseSearchParams<T>(searchParams, defaultParams));
		};
		window.addEventListener('URLChange', onUrlChange);

		return () => {
			window.removeEventListener('URLChange', onUrlChange);
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return searchParams;
};
