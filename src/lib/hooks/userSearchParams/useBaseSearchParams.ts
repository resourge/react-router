import { useState } from 'react';

import { parseSearchParams } from '@resourge/history-store/utils';

import { useRoute } from '../../contexts/RouteContext';

/**
 * Returns the current search parameters
 * @param defaultParams {T}
 */
export const useBaseSearchParams = <T extends Record<string, any>>(defaultParams?: T) => {
	const { search, hash } = useRoute();

	const [searchParams, setSearchParams] = useState(() => {
		const searchParams = new URLSearchParams(search ? `?${search}` : '');

		return parseSearchParams<T>(searchParams, defaultParams);
	});

	return {
		searchParams, 
		setSearchParams,
		hash
	} as const;
};
