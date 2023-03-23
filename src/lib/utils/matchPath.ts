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
	 * Hash path
	 */
	hashPath?: string
}

/**
 * Method to match href to {@link MatchProps path}
 * @param _href {string}
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

	const url = new URL(href)

	const _href = matchProps.hash ? `${url.origin}${url.hash.substring(1)}` : href.substring(0, href.indexOf('#'))

	const match = urlPattern.exec(_href);

	if ( match ) {
		const search = match.search.input;

		const unique = _href;

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

					const match = pattern.exec(_href);

					if ( match ) {
						const matchUrl = match.pathname;

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
			hash: hash ?? false,
			hashPath
		}
	}

	return null
}
