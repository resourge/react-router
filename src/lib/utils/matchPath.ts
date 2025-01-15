import { FIT_IN_ALL_ROUTES } from './constants';
import { getUrlPattern, type UrlPattern } from './getUrlPattern';
import { getHrefWhenHashOrNormal } from './utils';

type MatchProps = UrlPattern & {
	currentPath?: string
	paths?: string[]
};

export type MatchResult<Params extends Record<string, string> = Record<string, string>> = {
	/**
	 * Check if URL for current route was changed
	 */
	checkNewVersion: (url: URL) => boolean
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
	 * If URL pattern is exact
	 */
	exact?: boolean
	/**
	 * All possible paths for the route
	 */
	paths?: string[]
	/**
	 * Route URL
	 */
	url?: URL
};

function getUniqueId(path: string, match: URLPatternResult) {
	const { pathname } = match;
	const group = pathname.groups[0];
	const input = pathname.input;
	
	if (group) {
		const index = input.indexOf(group);
		const length = group.length;

		return path.includes(FIT_IN_ALL_ROUTES)
			? input.substring(index + length)
			: input.substring(0, index);
	}

	return input;
}

/**
 * Method to match href to {@link MatchProps path}
 * @param _href {string}
 * @param matchProps {@link MatchProps} - props to define the route
 */
export function matchPath<Params extends Record<string, string> = Record<string, string>>(
	url: URL,
	{
		hash, path, exact, paths, baseURL
	}: MatchProps
): MatchResult<Params> | null {
	const urlPattern = getUrlPattern({
		hash, path, exact, baseURL 
	});
	const _href = getHrefWhenHashOrNormal(url, hash);

	const match = urlPattern.exec(_href);

	if ( match ) {
		const search = match.search.input;
		const unique = getUniqueId(path, match);

		return {
			url,
			exact, 
			unique,
			path,
			paths,
			search,
			checkNewVersion: (url: URL) => {
				const _href = getHrefWhenHashOrNormal(url, hash);
				const match = urlPattern.exec(_href);

				return match ? unique === getUniqueId(path, match) : false;
			},
			getParams: () => {
				const { groups } = match.pathname;

				return Object.entries(groups)
				.filter(([key, value]) => key !== '0' && value)
				.reduce<Record<string, string>>((obj, [key, value]) => {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					obj[key] = value!;

					return obj;
				}, {}) as Params;
			},
			hash: hash ?? false
		};
	}

	return null;
}
