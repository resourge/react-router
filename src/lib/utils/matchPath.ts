import { getUrlPattern, type UrlPattern } from './getUrlPattern';

export type MatchProps = UrlPattern

export type MatchResult<Params extends Record<string, string> = Record<string, string>> = {
	/**
	 * Current {@link URLPatternResult}
	 */
	match: URLPatternResult
	/**
	 * Current route params
	 */
	params: Params

	/**
	 * Current route path (merged with previous path's)
	 */
	path: string
	/**
	 * Unique id for route. (prevents routes from rendering again if nothing changed)
	 */
	unique: string

	/**
	 * Current route URL
	 */
	url: URL
	/**
	 * Current {@link URLPattern}
	 */
	urlPattern: URLPattern

	/**
	 * If current route is hashed
	 */
	hash?: boolean
	/**
	 * Hash path
	 */
	hashPath?: string
}

/**
 * Method to match href to {@link MatchProps path}
 * @param href {string}
 * @param matchProps {@link MatchProps} - props to define the route
 */
export const matchPath = <Params extends Record<string, string> = Record<string, string>>(
	href: string,
	matchProps: MatchProps
): MatchResult<Params> | null => {
	const {
		hash, path, hashPath 
	} = matchProps;
	const pattern = getUrlPattern(matchProps);

	const match = pattern.exec(href);

	if ( match ) {
		const matchUrl = hash ? match.hash : match.pathname;

		const pathname = matchUrl.groups[0] 
			? matchUrl.input.replace(`/${matchUrl.groups[0]}`, '') 
			: matchUrl.input

		const search = hash ? '' : match.search.input;

		const url = new URL(
			`${pathname}${search ? `?${search}` : ''}`,
			window.location.origin
		)

		const params: Params = Object.entries(matchUrl.groups)
		.reduce<Record<string, string>>((obj, [key, value]) => {
			if ( key !== '0' && value ) {
				obj[key] = value;
			}

			return obj;
		}, {}) as Params

		const unique = hash 
			? href.substring(href.indexOf(match.hash.input), href.length) 
			: href.substring(0, href.lastIndexOf(match.hash.input));

		return {
			unique,
			path,
			url,
			params,
			urlPattern: pattern,
			match,
			hash,
			hashPath
		}
	}

	return null
}
