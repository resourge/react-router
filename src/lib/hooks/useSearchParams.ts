import { useMemo } from 'react';

import { parseParams, parseSearchParams, createNewUrlWithSearch } from '@resourge/react-search-params';

import { useRoute } from '../contexts/RouteContext';
import { useUrl } from '../contexts/RouterContext';

import { useNavigate } from './useNavigate';

/**
 * Returns the current search parameters and a method to change
 * @param defaultParams {T}
 */
export const useSearchParams = <T extends Record<string, any>>(defaultParams?: T) => {
	const {
		hash,
		url: routeUrl
	} = useRoute();
	const url = useUrl();
	const navigate = useNavigate()

	const search = routeUrl.search;
	const _searchParams = routeUrl.searchParams;

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const searchParams = useMemo(() => parseSearchParams<T>(_searchParams, defaultParams), [search]);

	const setParams = (newParams: Partial<T>) => {
		const newSearch = parseParams(newParams);

		if (search !== newSearch) {
			const newURL = createNewUrlWithSearch(url, newSearch, hash);

			navigate(newURL)
		}
	};

	return [searchParams, setParams] as const;
}
