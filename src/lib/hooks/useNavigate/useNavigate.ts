import { HistoryStore, type NavigateOptions as RNavigateOptions } from 'node_modules/@resourge/history-store/dist/index.js';

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
			action, preventScrollReset = false, replace = false 
		} = options;

		const url = generateUrl(to);

		if ( globalThis.location.href === url.href ) {
			return;
		}

		HistoryStore.navigate(
			url, 
			{
				action,
				replace 
			}
		);

		if ( !preventScrollReset ) {
			window.scrollTo(0, 0);
		}
	};
};
