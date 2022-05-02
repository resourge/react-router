import { FC, PropsWithChildren } from 'react';

import { HistoryContext } from '../contexts/HistoryContext';
import { LocationContext } from '../contexts/LocationContext';
import { RouterConfig, useRouter } from '../hooks/useRouter';

export type RouterProps = PropsWithChildren<RouterConfig>

/**
 * First component that location and history context for the rest of the children.
 *
 * Note: This component mainly uses `useRouter` hook.
 */
const Router: FC<RouterProps> = ({ 
	children, 
	...routerProps
}) => {
	const {
		historyContext,
		locationContext
	} = useRouter(routerProps);

	return (
		<HistoryContext.Provider value={historyContext}>
			<LocationContext.Provider value={locationContext}>
				{ children }
			</LocationContext.Provider>
		</HistoryContext.Provider>
	);
};

export default Router;
