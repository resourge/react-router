import { type Metadata } from '../types/Metadata';

import { getUrlPattern, type UrlPattern } from './getUrlPattern';

export type MatchProps = UrlPattern

export type MatchResult<Params extends Record<string, string> = Record<string, string>> = {
	/**
	 * Get current route params
	 */
	getParams: () => Params
	/**
	 * If current route is hashed
	 */
	hash: boolean
	/**
	 * Current route path (merged with previous path's)
	 */
	path: string
	/**
	 * Current route search
	 */
	search: string
	/**
	 * Unique id for route. (prevents routes from rendering again if nothing changed)
	 */
	unique: string
	/**
	 * Base url
	 */
	baseURL?: string
	/**
	 * If URL pattern is exact
	 */
	exact?: boolean
	/**
	 * Hash path
	 */
	hashPath?: string
	/**
	 * Route metadata
	 */
	metadata?: Metadata
}

/**
 * Method to match href to {@link MatchProps path}
 * @param _href {string}
 * @param matchProps {@link MatchProps} - props to define the route
 */
export function matchPath<Params extends Record<string, string> = Record<string, string>>(
	href: string,
	matchProps: MatchProps
): MatchResult<Params> | null {
	const {
		hash, path, hashPath, exact, baseURL
	} = matchProps;
	const urlPattern = getUrlPattern(matchProps);

	let _href = '';
	if ( matchProps.hash ) {
		const url = new URL(href);
		_href = `${url.origin}${url.hash.substring(1)}`
	}
	else {
		const hashIndex = href.indexOf('#')
		_href = href.substring(0, hashIndex > -1 ? hashIndex : undefined)
	}

	const match = urlPattern.exec(_href);

	if ( match ) {
		const search = match.search.input;

		const unique = _href;

		return {
			exact, 
			baseURL,
			unique,
			path,
			search,
			metadata: arguments[3],
			getParams: () => {
				const matchUrl = match.pathname;

				return (Object.entries(matchUrl.groups)
				.filter(([key, value]) => key !== '0' && value) as Array<[string, string]>)
				.reduce<Record<string, string>>((obj, [key, value]) => {
					obj[key] = value

					return obj;
				}, {}) as Params
			},
			hash: hash ?? false,
			hashPath
		}
	}

	return null
}
