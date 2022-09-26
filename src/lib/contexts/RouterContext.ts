import { createContext, useContext } from 'react';

import invariant from 'tiny-invariant'

export const RouterContext = createContext<URL>(new URL(window.location.href));

/**
 * Hook to access to current URL
 */
export const useUrl = () => {
	const context = useContext(RouterContext);

	if ( __DEV__ ) {
		invariant(context, 'useUrl can only be used in the context of a <RouterContext>.')
	}

	return useContext(RouterContext)
}
