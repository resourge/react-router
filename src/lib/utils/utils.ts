export function getHrefWhenHashOrNormal(url: URL, hash?: boolean) {
	if ( hash ) {
		return `${url.origin}${url.hash.substring(1)}`;
	}
	const hashIndex = url.href.indexOf('#');
	return url.href.substring(0, hashIndex > -1 ? hashIndex : undefined);
}

export function isValidUrl(urlString: string) {
	try { 
		return Boolean(new URL(urlString)); 
	}
	catch (e) { 
		return false; 
	}
}
