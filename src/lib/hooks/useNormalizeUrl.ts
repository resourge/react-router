import { useLanguageContext } from '../contexts/LanguageContext';
import { useRouter } from '../contexts/RouterContext';
import { resolveLocation, resolveSlash } from '../utils/resolveLocation';

export type NavigateTo = string | URL

const normalizeUrl = (
	to: NavigateTo, 
	url: URL,
	base?: string
): URL => {
	// If to is string, resolve to with current url
	if ( typeof to === 'string' ) {
		if ( to.startsWith(`/${base}`) ) {
			return resolveLocation(to, url.href)
		}
		return resolveLocation(base ? resolveSlash(base, to) : to, url.href)
	}
	
	return to
}

/**
 * Returns a method for making a url from `to`.
 */
export const useNormalizeUrl = () => {
	const { url } = useRouter();
	const base = useLanguageContext();

	return (to: NavigateTo) => {
		return normalizeUrl(
			to,
			url,
			base
		)
	}
}
