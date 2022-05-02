import { Action, RouteLocation } from '../contexts/LocationContext';

/**
 * Parses a string path into RouteLocation.
 */
export function parsePath(path: string, action: Action): RouteLocation {
	let hash = '';
	let search = '';
	let pathname = '';
	const _path = path;
  
	if ( _path ) {
		const hashIndex = _path.indexOf('#');
		if (hashIndex >= 0) {
			hash = _path.substr(hashIndex);
			path = _path.substring(0, hashIndex);
		}
	
		const searchIndex = _path.indexOf('?');
		if (searchIndex >= 0) {
			search = _path.substr(searchIndex);
			path = _path.substring(0, searchIndex);
		}
	
		if (_path) {
			pathname = _path;
		}
	}
  
	return {
		state: undefined,
		hash,
		action,
		path,
		search,
		pathname
	};
}
