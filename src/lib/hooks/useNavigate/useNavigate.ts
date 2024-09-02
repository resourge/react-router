import { HistoryStore, type NavigateOptions as RNavigateOptions } from '@resourge/history-store';

import { useNormalizeUrl } from '../useNormalizeUrl/useNormalizeUrl';
import { type NavigateTo } from '../useNormalizeUrl/useNormalizeUrlUtils';

import { type NavigateMethod } from './useNavigateType';

export type NavigateOptions = RNavigateOptions & {
	/**
	 * Prevents scroll reset
	 * @default false
     * @platform web
	 */
	preventScrollReset?: boolean
};

/**
 * Returns a method for navigation `to`.
 */
export const useNavigate = (): NavigateMethod<NavigateOptions> => {
	const generateUrl = useNormalizeUrl();

	return (to: NavigateTo, options: NavigateOptions = {}) => {
		const {
			replace = false, action, preventScrollReset = false 
		} = options;

		const url = generateUrl(to);

		if ( window.location.href === url.href ) {
			return;
		}

		HistoryStore.navigate(
			url, 
			{
				replace, action 
			}
		);

		if ( !preventScrollReset ) {
			window.scrollTo(0, 0);
		}
	};
};
