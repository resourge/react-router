import { type ActionType } from '@resourge/react-search-params';

import { type NavigateTo, useNormalizeUrl } from './useNormalizeUrl';

export type NavigateOptions = {
	/**
	 * A way to specify the action
	 * @default false
	 */
	action?: Exclude<ActionType, 'initial'>
	/**
	 * Prevents scroll reset
	 * @default false
	 */
	preventScrollReset?: boolean
	/**
	 * Replaces path instead of push
	 * @default false
	 */
	replace?: boolean
}

/**
 * Returns a method for navigation `to`.
 */
export const useNavigate = () => {
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
	}
}
