import { createContext, useContext } from 'react';

import { NavigationActionType } from '../types/NavigationActionType';

export type RouterContextType = {
	action: NavigationActionType
	previousAction?: NavigationActionType

	previousUrl?: URL
	url: URL
};

export const RouterContext = createContext<null | RouterContextType>(null);

/**
 * Hook to access to current URL
 */
export const useRouter = (): RouterContextType => {
	const context = useContext(RouterContext);

	if ( process.env.NODE_ENV === 'development' && !context ) {
		throw new Error('useRouter can only be used in the context of a <RouterContext>.');
	}
	
	return context!;
};
