import { useNormalizeUrl } from '../useNormalizeUrl/useNormalizeUrl';
import { type NavigateTo } from '../useNormalizeUrl/useNormalizeUrlUtils';

import { type NavigateMethod, type BaseNavigateOptions } from './useNavigateType';

export type NavigateOptions = BaseNavigateOptions;

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

		window.history[replace ? 'replaceState' : 'pushState'](action ? {
			action 
		} : null, '', url);

		if ( !preventScrollReset ) {
			window.scrollTo(0, 0);
		}
	};
};
