type Path = {
	pathname: string
	search?: string
	hash?: string
}

/**
 * Method to create "path" (`${pathname}${search}${hash}`)
 */
export function createPath({
	pathname = '/',
	search = '',
	hash = ''
}: Path) {
	if (search && search !== '?') {
		pathname += search.charAt(0) === '?' ? search : '?' + search;
	}
	if (hash && hash !== '#') {
		pathname += hash.charAt(0) === '#' ? hash : '#' + hash;
	}
	return pathname;
}
