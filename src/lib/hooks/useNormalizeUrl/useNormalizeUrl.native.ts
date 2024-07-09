import { History } from 'src/lib/utils/createHistory/createHistory.native';

import { useLanguageContext } from '../../contexts/LanguageContext';
import { useRoute } from '../../contexts/RouteContext';

import { type NavigateTo, normalizeUrl } from './useNormalizeUrlUtils';

/**
 * Returns a method for making a url from `to`.
 * 
 * to - Can an string, URL or { searchParams: object }.
 * * Note: { searchParams: object } will replace current `URL` URLSearchParams
 */
export const useNormalizeUrl = () => {
	const { hash } = useRoute();
	const base = useLanguageContext();

	return (to: NavigateTo) => {
		return normalizeUrl(
			to,
			new URL(History.state.url.href),
			base,
			hash
		);
	};
};
