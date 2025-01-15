import { useEffect } from 'react';

import { History, type NavigationState } from '@resourge/history-store/mobile';
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
		const onUrlChange = ({ url }: NavigationState) => {
			const _href = getHrefWhenHashOrNormal(url, hash);

			const searchParams = new URL(_href).searchParams;

			setSearchParams(parseSearchParams<T>(searchParams, defaultParams));
		};

		const remove = History.addEventListener('URLChange', onUrlChange);

		return () => remove();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return searchParams;
};
