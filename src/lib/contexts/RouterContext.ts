import { createContext, useContext } from 'react';

import { type ActionType } from '@resourge/react-search-params';

import { type NavigationActionType } from '../utils/createHistory/HistoryType';

export type RouterContextType = {
	action: ActionType | NavigationActionType
	url: URL

	previousAction?: ActionType | NavigationActionType
	previousUrl?: URL
};

export const RouterContext = createContext<RouterContextType | null>(null);

/**
 * Hook to access to current URL
 */
export const useRouter = (): RouterContextType => {
	const context = useContext(RouterContext);

	if ( process.env.NODE_ENV === 'development' ) {
		if ( !context ) {
			throw new Error('useRouter can only be used in the context of a <RouterContext>.');
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return context!;
};
