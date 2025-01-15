import { useEffect } from 'react';

import { type UrlChangeEvent } from '@resourge/history-store';
import { parseSearchParams } from '@resourge/history-store/utils';

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
			const _href = getHrefWhenHashOrNormal(url, hash);

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
