import { useEffect } from 'react';

import { parseSearchParams } from '@resourge/react-search-params/dist/utils/parseSearch';

import { type NavigationState } from 'src/lib/utils/createHistory/HistoryType';
import { History } from 'src/lib/utils/createHistory/createHistory.native';

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
			const _href = getHrefWhenHashOrNormal(new URL(url as unknown as string), hash);

			const searchParams = new URL(_href).searchParams;

			setSearchParams(parseSearchParams<T>(searchParams, defaultParams));
		};

		const { remove } = History.addEventListener('URLChange', onUrlChange);

		return () => remove();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return searchParams;
};
