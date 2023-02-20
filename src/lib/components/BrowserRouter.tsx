import { type FC, type PropsWithChildren } from 'react';

import { useUrl } from '@resourge/react-search-params';

import { RouterContext } from '../contexts/RouterContext';

import Route, { type BaseRouteProps } from './Route';

export type BrowserRouterProps = PropsWithChildren<{
	base?: string
} & Omit<BaseRouteProps, 'path'>>

/**
 * First component that creates the context for the rest of the children.
 *
 * Note: This component mainly uses `useUrl` hook from '@resourge/react-search-params'.
 */
const BrowserRouter: FC<BrowserRouterProps> = ({
	base = '', children, ...routeProps 
}) => {
	const [url, action] = useUrl();

	return (
		<RouterContext.Provider 
			value={{
				url,
				action 
			}}
		>
			<Route path={base} {...routeProps}>
				{ children }
			</Route>
		</RouterContext.Provider>
	);
};

export default BrowserRouter;
