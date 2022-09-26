
import { NavigateTo, useNormalizeUrl } from './useNormalizeUrl';

export type NavigateOptions = {
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
		const { replace = false } = options;

		const url = generateUrl(to);

		if ( window.location.href === url.href ) {
			return;
		}
		window.history[replace ? 'replaceState' : 'pushState'](null, '', url);
	}
}
