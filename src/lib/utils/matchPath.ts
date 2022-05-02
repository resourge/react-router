import { match, MatchFunction } from 'path-to-regexp'

import { RouteLocation } from '../contexts';

export type MatchPathConfig = Parameters<typeof match>[1]

const cache = new Map();
const cacheLimit = 10000;
let cacheCount = 0;

export const getPathToMatch = (location: RouteLocation, hash?: boolean) => {
	return hash ? location.hash.replace('#', '') : location.pathname;
}

/**
 * Wrapper to cache `path-to-regexp` match
 * Note: Caches max 10000
 * @returns Method to match `URL`
 */
export function matchPath<Params extends Record<string, string>>(
	path: string, 
	options: MatchPathConfig = {
		end: false
	}
): MatchFunction<Params> {
	const end = options.end ?? false;
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	const cacheKey = `${path}_${end}_${options.strict ?? ''}_${options.sensitive ?? ''}`;
	if (cache.has(cacheKey)) return cache.get(cacheKey);

	const generator = match<Params>(path, { ...options, end });

	if (cacheCount < cacheLimit) {
		cache.set(cacheKey, generator)
		cacheCount++;
	}

	return generator;
}
