/* eslint-disable no-useless-escape */

/**
 * Resolves slash
 */
export function resolveSlash(...args: Array<string | undefined>) {
	return `/${(args.filter((pathname) => pathname) as string[])
	.map((pathname: string) => {
		pathname = pathname.trim();
		if ( pathname.charAt(0) === '/' ) {
			pathname = pathname.substring(1)
		}

		const pathnameLength = pathname.length - 1;
		if ( pathname.charAt(pathnameLength) === '/' ) {
			pathname = pathname.substring(0, pathnameLength)
		} 

		return pathname
	}).join('/')}`
}

/**
 * Method to resolve `URL`'s
 *  Ex:
 * baseUrl: /home/dashboard
 * 
 * url: "/home" // /home
 * url: "home" // /home/dashboard/home
 * url: "about" // /home/dashboard/about
 * url: "./about" // /home/dashboard/about
 * url: "/about" // /about
 * url: "../contact" // /home/contact
 * url: "../../products" // /products
 * url: "../../../products" // /products
 */
export function resolveLocation(url: string, baseURL?: string): URL {
	const m = String(url)
	.replace(/^\s+|\s+$/g, '')
	.match(/^([^:\/?#]+:)?(?:\/\/(?:([^:@\/?#]*)(?::([^:@\/?#]*))?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
	if (!m) {
		throw new RangeError();
	}
	let pathname = m[7] || '';
	let search = m[8] || '';
	const hash = m[9] || '';
	if (baseURL !== undefined) {
		const base = resolveLocation(baseURL);
		if (pathname === '' && search === '') {
			search = base.search;
		}
		/* if (pathname.charAt(0) !== '/') {
			pathname = (pathname !== '' ? `${(base.pathname === '' ? '/' : '')}${base.pathname.lastIndexOf('/') !== base.pathname.length ? `${base.pathname}/` : base.pathname}${pathname}` : base.pathname);
		} */
		if (pathname.charAt(0) !== '/') {
			pathname = (pathname !== '' ? `${(base.pathname === '' ? '/' : '')}${base.pathname.slice(0, (base.pathname ).lastIndexOf('/') + 1)}${pathname}` : base.pathname);
		}
		// dot segments removal
		const output: string[] = [];
		pathname.replace(/^(\.\.?(\/|$))+/, '')
		.replace(/\/(\.(\/|$))+/g, '/')
		.replace(/\/\.\.$/, '/../')
		.replace(/\/?[^\/]*/g, (p) => {
			if (p === '/..') {
				output.pop();
			}
			else {
				output.push(p);
			}
			return p;
		});
		pathname = output.join('')
		.replace(/^\//, pathname.charAt(0) === '/' ? '/' : '');
	}

	return new URL(
		pathname + search + hash,
		window.location.origin
	)
}
