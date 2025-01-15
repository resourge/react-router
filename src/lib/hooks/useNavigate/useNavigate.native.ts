import { HistoryStore, type NavigateOptions } from '@resourge/history-store/mobile';

import { useNormalizeUrl } from '../useNormalizeUrl/useNormalizeUrl.native';
import { type NavigateTo } from '../useNormalizeUrl/useNormalizeUrlUtils';

import { type NavigateMethod } from './useNavigateType';

/**
 * Returns a method for navigation `to`.
 */
export const useNavigate = (): NavigateMethod<NavigateOptions> => {
	const generateUrl = useNormalizeUrl();

	/**
	 * Navigates to the specified URL.
	 * @param to - The target URL or path to navigate to.
	 * @param options - Navigation options, such as whether to replace the current entry or perform a specific action.
	 */
	return (to: NavigateTo, options: NavigateOptions = {}) => {
		const { replace = false, action } = options;

		const url = generateUrl(to);

		if ( HistoryStore.getValue()[0].href === url.href ) {
			return;
		}

		HistoryStore.navigate(url, {
			replace,
			action
		});
	};
};
