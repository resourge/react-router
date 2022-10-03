import { useRoute } from '../contexts/RouteContext';
import { useRouter } from '../contexts/RouterContext';
import { generatePath } from '../utils/generatePath';
import { resolveLocation } from '../utils/resolveLocation';

type NavigateURL = Pick<Partial<URL>, 'pathname' | 'hash' | 'search'> 

type NavigateParams = {
	params: Record<string, any>
}

type NavigateObject = NavigateURL | NavigateParams

export type NavigateTo = string | URL | NavigateObject | ((url: URL, routeUrl: URL) => string | URL | NavigateObject)

const normalizeUrl = (
	to: NavigateTo, 
	path: string,
	params: Record<string, any>,
	url: URL, 
	routeUrl: URL
): URL => {
	// If to is string, resolve to with current url
	if ( typeof to === 'string' ) {
		return resolveLocation(to, url.href)
	}
	// If to is URL, just navigate to URL
	else if ( to instanceof URL ) {
		return to
	}
	else if ( typeof to === 'function' ) {
		return normalizeUrl(
			to(url, routeUrl),
			path,
			params,
			url,
			routeUrl
		);
	}
	else {
		const newUrl = new URL(url);

		if ( (to as NavigateParams).params ) {
			if ( path ) {
				const newParams = {
					...params,
					...(to as NavigateParams).params
				}
	
				const newPath = generatePath(path, newParams);
				newUrl.pathname = newPath;
			}
		}
		else {
			(Object.entries(to) as Array<[keyof NavigateURL, string]>)
			.forEach(([key, value]) => {
				newUrl[key] = value;
			})
		}

		return newUrl
	}
}

/**
 * Returns a method for making a url from `to`.
 */
export const useNormalizeUrl = () => {
	const { url } = useRouter();
	const {
		url: routeUrl,
		params,
		path
	} = useRoute();

	return (to: NavigateTo) => {
		return normalizeUrl(
			to,
			path,
			params,
			url,
			routeUrl
		)
	}
}
