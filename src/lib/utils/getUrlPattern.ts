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
	hashPath?: string
}

export const getUrlPattern = ({
	path, baseURL, hash, hashPath, exact
}: UrlPattern): URLPattern => {
	const _exact = exact ?? false;
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	if (cacheCompile.has(`${path}_${String(hashPath)}_${String(exact)}`)) return cacheCompile.get(`${path}_${String(hashPath)}_${String(exact)}`)!;

	const pathname = `${hash ? (hashPath ?? '').substring(1) : path}${_exact ? '' : '{/*}?'}`;

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
		cacheCompile.set(`${path}_${String(hash)}`, generator);
	}

	return generator;
};
