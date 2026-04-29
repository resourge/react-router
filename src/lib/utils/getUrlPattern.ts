const cacheCompile = new Map<string, URLPattern>();
const cacheLimit = 10_000;

export type UrlPattern = {
	baseURL?: string
	/**
	 * @default false
	 */
	exact?: boolean
	hash?: boolean
	path: string
};

export const getUrlPattern = ({
	baseURL, exact, hash, path
}: UrlPattern): URLPattern => {
	const key = `${path}_${String(exact)}_${String(hash)}`;
	if (cacheCompile.has(key)) {
		return cacheCompile.get(key)!; 
	}

	const pathname = `${path.replace('#', '')}${exact
		? ''
		: '{/*}?'}`;

	const generator = new URLPattern({
		baseURL,
		hash: '*',
		hostname: '*',
		pathname,
		port: '*',
		protocol: '*',
		search: '*'
	});

	if (cacheCompile.size < cacheLimit) {
		cacheCompile.set(key, generator);
	}

	return generator;
};
