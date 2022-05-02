import { useCallback } from 'react';

import warning from 'tiny-warning';

import { useRouteContext } from '../contexts';

import { NavigateOptions, NavigateTo, useNavigate } from './useNavigate';

export type HashNavigateOptions = Omit<NavigateOptions, 'hash'>

/**
 * Returns a method for changing hash location.
 */
export const useHashNavigate = (): (
<Params extends object, Search extends object, State = any>(
	to: NavigateTo<Params, Search, State>,
	options?: HashNavigateOptions
) => void
) => {
	const _navigate = useNavigate();
	const route = useRouteContext();

	warning(route && route.hash, 'useHashNavigate is not being used inside a hash route, this can lead to navigation problems.')
	
	const navigate = useCallback(
		<Params extends object = object, Search extends object = object, State = any>(
			to: NavigateTo<Params, Search, State>,
			{ replace = false, resolveToLocation: _resolveToLocation = true }: HashNavigateOptions = {}
		) => {
			_navigate(to, { replace, resolveToLocation: _resolveToLocation, hash: true })
		}, 
		[_navigate]
	);

	return navigate
}
