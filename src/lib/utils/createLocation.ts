/* eslint-disable no-useless-escape */
/* eslint-disable no-restricted-globals */
import { Action, RouteLocation } from '../contexts/LocationContext';

import { createPath } from './createPath'

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
export function resolveToLocation(url: string, _baseURL?: string): Omit<RouteLocation, 'action' | 'state'> {
	const baseURL = _baseURL ? (_baseURL.lastIndexOf('/') === _baseURL.length - 1) ? _baseURL : `${_baseURL}/` : undefined
	const m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(?:\/\/(?:([^:@\/?#]*)(?::([^:@\/?#]*))?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
	if (!m) {
		throw new RangeError();
	}
	let pathname = m[7] || '';
	let search = m[8] || '';
	const hash = m[9] || '';
	if (baseURL !== undefined) {
		const base = resolveToLocation(baseURL);
		if (pathname === '' && search === '') {
			search = base.search;
		}
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
		pathname = output.join('').replace(/^\//, pathname.charAt(0) === '/' ? '/' : '');
	}

	return {
		hash,
		path: pathname + search + hash,
		pathname,
		search
	}
}

export const createLocation = (action: Action, isHash?: boolean): RouteLocation => {
	const { 
		hash,
		pathname,
		search
	} = location;

	return {
		state: window.history.state,
		action,
		hash,
		pathname,
		search,
		path: createPath(
			isHash ? { 
				hash: '',
				pathname: hash,
				search
			} : { 
				hash,
				pathname,
				search
			}
		)
	}
}
