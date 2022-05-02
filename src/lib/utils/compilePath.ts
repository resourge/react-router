import { compile, PathFunction } from 'path-to-regexp'

const cacheCompile = new Map();
const cacheLimit = 10000;
let cacheCompileCount = 0;

/**
 * Wrapper to cache `path-to-regexp` compile
 * Note: Caches max 10000
 * @param path 
 * @returns Method to compile params into pathname
 */
export function compilePath(
	path: string
): PathFunction<any> {
	if (cacheCompile.has(path)) return cacheCompile.get(path);

	const generator = compile(path, { validate: false });

	if (cacheCompileCount < cacheLimit) {
		cacheCompile.set(path, generator)
		cacheCompileCount++;
	}

	return generator;
}
