import invariant from 'tiny-invariant';

/**
 * Converter param's of path into there respective value.
 * @param path {string}
 * @param params {T} Object containing key and values of path params
 * @returns 
 */
export function generatePath<T extends Record<string, any>>(path: string, params: T): string {
	return path
	.replace(/{{0,1}\/{0,1}:(\w+)(\(.*\)){0,1}}{0,1}\?{0,1}/g, (originalKey, key: string) => {
		const value: string | undefined = params[key];
		if ( __DEV__ ) {
			invariant(!(!originalKey.includes('?') && value === undefined), `Value of key '${key}' for path '${path}' cannot be undefined.`);
		}
		const includesSlash = originalKey.includes('/');
		return `${includesSlash ? '/' : ''}${value ?? ''}`;
	})
	.replace(/\/*\*$/, () => params['*'] == null ? '' : params['*'].replace(/^\/*/, '/'));
}
