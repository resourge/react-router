import { useCallback, useMemo } from 'react';

import { useLocation } from './useLocation';
import { NavigateOptions, useNavigate } from './useNavigate';

/**
 * Parses search string into object using `URLSearchParams`
 */
const parseSearch = <T extends object>(search: string): T => {
	const params = new URLSearchParams(search.replace('?', ''));

	return Object.fromEntries(params) as T;
}

/**
 * Returns the current search parameters and a method to change
 */
export const useSearchParams = <T extends object>() => {
	const _navigate = useNavigate()
	const location = useLocation();

	const params = useMemo(() => parseSearch<T>(location.search), [location.search])

	const setSearchParams = useCallback(<SearchParams extends object>(searchParams: SearchParams, { replace = true, resolveToLocation }: NavigateOptions = {}) => {
		_navigate(
			{
				pathname: location.pathname,
				search: searchParams,
				hash: location.hash
			},
			{
				replace,
				resolveToLocation
			}
		)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname]);

	return [params, setSearchParams] as const
}
