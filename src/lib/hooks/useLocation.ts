
import { useContext } from 'react';

import invariant from 'tiny-invariant'

import { LocationContext, RouteLocation } from '../contexts/LocationContext';

/**
 * Returns the current location object
 */
export const useLocation = <State = any>() => {
	const context = useContext<RouteLocation<State>>(LocationContext)

	invariant(context, 'useLocation can only be used in the context of a <LocationContext/Router> component.')

	return context
}
