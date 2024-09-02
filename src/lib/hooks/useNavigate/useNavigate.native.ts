import { HistoryStore, type NavigateOptions } from '@resourge/history-store/mobile';

import { useNormalizeUrl } from '../useNormalizeUrl/useNormalizeUrl.native';
import { type NavigateTo } from '../useNormalizeUrl/useNormalizeUrlUtils';

import { type NavigateMethod } from './useNavigateType';

/**
 * Returns a method for navigation `to`.
 */
export const useNavigate = (): NavigateMethod<NavigateOptions> => {
	const generateUrl = useNormalizeUrl();

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
