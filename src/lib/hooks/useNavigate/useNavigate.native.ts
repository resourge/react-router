import { History, type NavigateConfig } from 'src/lib/utils/createHistory/createHistory.native';

import { useNormalizeUrl } from '../useNormalizeUrl/useNormalizeUrl.native';
import { type NavigateTo } from '../useNormalizeUrl/useNormalizeUrlUtils';

import { type NavigateMethod, type BaseNavigateOptions } from './useNavigateType';

export type NavigateOptions = Omit<BaseNavigateOptions, 'preventScrollReset'> & Omit<NavigateConfig, 'replace'>;

/**
 * Returns a method for navigation `to`.
 */
export const useNavigate = (): NavigateMethod<NavigateOptions> => {
	const generateUrl = useNormalizeUrl();

	return (to: NavigateTo, options: NavigateOptions = {}) => {
		const {
			replace = false, action, stack
		} = options;

		const url = generateUrl(to);

		if ( History.state.url.href === url.href ) {
			return;
		}

		History.navigate(url, {
			replace,
			action,
			stack 
		});
	};
};
