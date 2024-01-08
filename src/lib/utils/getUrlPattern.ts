// To remove when URLPattern becomes native
import 'urlpattern-polyfill';

const cacheCompile = new Map<string, URLPattern>();
const cacheLimit = 10000;

export type UrlPattern = {
	path: string
	baseURL?: string
	/**
	 * @default false
	 */
	exact?: boolean
	hash?: boolean
}

export const getUrlPattern = ({
	path, baseURL, exact, hash
}: UrlPattern): URLPattern => {
	const _exact = exact ?? false;
	const key = `${path}_${String(exact)}_${String(hash)}`;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	if (cacheCompile.has(key)) return cacheCompile.get(key)!;

	const pathname = `${path.replace('#', '')}${_exact ? '' : '{/*}?'}`;

	const generator = new URLPattern(
		{
			baseURL,
			hostname: '*',
			port: '*',
			protocol: '*',
			pathname,
			hash: '*',
			search: '*'
		}
	);

	if (cacheCompile.size < cacheLimit) {
		cacheCompile.set(key, generator);
	}

	return generator;
};
