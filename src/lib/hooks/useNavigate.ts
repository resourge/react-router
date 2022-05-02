import { useCallback } from 'react';

import { RouteLocation } from '../contexts';
import { compilePath } from '../utils/compilePath';
import { resolveToLocation } from '../utils/createLocation';
import { createPath } from '../utils/createPath';

import { useHistory } from './useHistory';
import { useLocation } from './useLocation';

type NavigateBase<Search extends object, State = any> = {
	search?: Search
	hash?: string
	state?: State
}

type NavigatePath<Params extends object, Search extends object, State = any> = {
	path: string
	params: Params
} & NavigateBase<Search, State>

type NavigatePathName<Search extends object, State = any> = {
	pathname: string
} & NavigateBase<Search, State>

export type NavigateTo<Params extends object, Search extends object, State = any> = string | 
NavigatePath<Params, Search, State> | 
NavigatePathName<Search, State>

export type NavigateOptions = {
	/**
	 * Replaces path instead of push
	 * @default false
	 */
	replace?: boolean
	/**
	 * Resolves `to` to current location
	 * Ex:
	 * Url: /home/dashboard
	 * 
	 * <Link to="/home">...</Link> // href: /home
	 * <Link to="home">...</Link> // href: /home/dashboard/home
	 * <Link to="about">...</Link> // href: /home/dashboard/about
	 * <Link to="/about">...</Link> // href: /about
	 * <Link to="../contact">...</Link> // href: /home/contact
	 * <Link to="../../products">...</Link> // href: /products
	 * <Link to="../../../products">...</Link> // href: /products
	 * 
	 * @default true
	 */
	resolveToLocation?: boolean
	/**
	 * When `true` and `to` is a string will replace `hash` instead of `pathname`
	 * @default false
	 */
	hash?: boolean
}

function serializeParams<T extends Record<string, any>>(state: T): string {
	const params = new URLSearchParams(state).toString();

	return `${params ? '?' : ''}${params}`
}

const getPath = <Params extends object, Search extends object>(
	to: NavigateTo<Params, Search>,
	location: RouteLocation,
	isHash?: boolean
) => {
	if ( typeof to === 'string' ) {
		if ( isHash ) {
			return createPath({
				pathname: location.pathname,
				search: location.search,
				hash: to
			})
		}
		return to;
	}

	let pathname: string = '';
	const search = to.search ? serializeParams(to.search) : '';
	const hash = to.hash ?? '';

	if ( (to as NavigatePath<Params, Search>).path ) {
		const _to: NavigatePath<Params, Search> = to as NavigatePath<Params, Search>;
		const toPath = compilePath(_to.path);

		pathname = toPath(_to.params);
	}
	else {
		pathname = (to as NavigatePathName<Search>).pathname
	}
		
	return (
		createPath({
			pathname,
			search,
			hash
		})
	)
}

/**
 * Returns a method for changing location.
 */
export const useNavigate = (): (
<Params extends object, Search extends object, State = any>(
	to: NavigateTo<Params, Search, State>,
	options?: NavigateOptions
) => void
) => {
	const history = useHistory();
	const location = useLocation();

	const navigate = useCallback(
		<Params extends object = object, Search extends object = object, State = any>(
			to: NavigateTo<Params, Search, State>,
			{ replace = false, hash = false, resolveToLocation: _resolveToLocation = true }: NavigateOptions = {}
		) => {
			const navigate = history[replace ? 'replace' : 'push'];

			let path = getPath(to, location, hash);

			if ( _resolveToLocation ) {
				path = resolveToLocation(path, `${location.path}/`).path
			}
				
			navigate(path, typeof to === 'object' ? to?.state : null)
		}, 
		[history, location]
	);

	return navigate
}
