import React, { FC, PropsWithChildren } from 'react';

import { useUrl } from '@resourge/react-search-params';

import { RouterContext } from '../contexts/RouterContext';

import Route, { BaseRouteProps } from './Route';

export type BrowserRouterProps = PropsWithChildren<{
	base?: string
} & Omit<BaseRouteProps, 'path'>>

/**
 * First component that creates the context for the rest of the children.
 *
 * Note: This component mainly uses `useUrl` hook.
 */
const BrowserRouter: FC<BrowserRouterProps> = ({
	base = '', children, ...routeProps 
}) => {
	const url = useUrl();

	return (
		<RouterContext.Provider value={url}>
			<Route path={base} {...routeProps}>
				{ children }
			</Route>
		</RouterContext.Provider>
	);
};

export default BrowserRouter;
