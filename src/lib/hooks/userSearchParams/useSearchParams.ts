import { useEffect } from 'react';

import { parseSearchParams, type UrlChangeEvent } from '@resourge/react-search-params';

import { getHrefWhenHashOrNormal } from '../../utils/utils';

import { useBaseSearchParams } from './useBaseSearchParams';

/**
 * Returns the current search parameters
 * @param defaultParams {T}
 */
export const useSearchParams = <T extends Record<string, any>>(defaultParams?: T) => {
	const {
		hash, searchParams, setSearchParams 
	} = useBaseSearchParams(defaultParams);

	useEffect(() => {
		const onUrlChange = ({ url }: UrlChangeEvent) => {
			const _href = getHrefWhenHashOrNormal(new URL(url as unknown as string), hash);

			const searchParams = new URL(_href).searchParams;

			setSearchParams(parseSearchParams<T>(searchParams, defaultParams));
		};

		window.addEventListener('URLChange', onUrlChange, false);

		return () => {
			window.removeEventListener('URLChange', onUrlChange, false);
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return searchParams;
};
