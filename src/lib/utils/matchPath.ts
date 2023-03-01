import { getUrlPattern, type UrlPattern } from './getUrlPattern';

export type MatchProps = UrlPattern & {
	/** */
	paths?: string[]
}

export type MatchResult<Params extends Record<string, string> = Record<string, string>> = {
	/**
	 * Get current route params
	 */
	getParams: () => Params
	/**
	 * Current {@link URLPatternResult}
	 */
	match: URLPatternResult

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
		hash, path, hashPath, paths
	} = matchProps;
	const urlPattern = getUrlPattern(matchProps);

	const match = urlPattern.exec(href);

	if ( match ) {
		const search = hash ? '' : match.search.input;

		const unique = hash 
			? href.substring(href.indexOf(match.hash.input), href.length) 
			: href.substring(0, href.lastIndexOf(match.hash.input));

		return {
			unique,
			path,
			search,
			getParams: () => {
				return (paths ?? [path])
				.map((path) => {
					const pattern = getUrlPattern({
						...matchProps,
						path
					});

					const match = pattern.exec(href);

					if ( match ) {
						const matchUrl = hash ? match.hash : match.pathname;

						return Object.entries(matchUrl.groups)
						.filter(([key, value]) => key !== '0' && value) as Array<[string, string]>
					}

					return []
				})
				.flat()
				.reduce<Record<string, string>>((obj, [key, value]) => {
					obj[key] = value

					return obj;
				}, {}) as Params
			},
			urlPattern,
			match,
			hash,
			hashPath
		}
	}

	return null
}
