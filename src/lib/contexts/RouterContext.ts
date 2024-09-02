import { createContext, useContext } from 'react';

import { type NavigationActionType as RNavigationActionType } from '@resourge/history-store/dist/types/navigationActionType/NavigationActionType';
import { type NavigationActionType as RNNavigationActionType } from '@resourge/history-store/dist/types/navigationActionType/NavigationActionType.native';

export type RouterContextType = {
	action: RNavigationActionType | RNNavigationActionType
	url: URL

	previousAction?: RNavigationActionType | RNNavigationActionType
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
