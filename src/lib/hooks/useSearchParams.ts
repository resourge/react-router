import { useMemo } from 'react';

import { parseParams, parseSearchParams, createNewUrlWithSearch } from '@resourge/react-search-params';

import { useRoute } from '../contexts/RouteContext';
import { useRouter } from '../contexts/RouterContext';

import { useNavigate } from './useNavigate';

/**
 * Returns the current search parameters and a method to change
 * @param defaultParams {T}
 */
export const useSearchParams = <T extends Record<string, any>>(defaultParams?: T) => {
	const {
		hash,
		search
	} = useRoute();
	const { url } = useRouter();
	const navigate = useNavigate()

	const searchParams = useMemo(() => {
		const searchParams = new URLSearchParams(search ? `?${search}` : '')

		return parseSearchParams<T>(searchParams, defaultParams)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search]);

	const setParams = (newParams: Partial<T>) => {
		const newSearch = parseParams(newParams);

		if (search !== newSearch) {
			const newURL = createNewUrlWithSearch(url, newSearch, hash);

			navigate(newURL)
		}
	};

	return [searchParams, setParams] as const;
}
