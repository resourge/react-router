import { cloneElement, FC, PropsWithChildren, ReactNode } from 'react';

import { RouteContext } from '../contexts/RouteContext';
import { RouteConfig, useRoute } from '../hooks/useRoute';

type BaseRouteProps = {
	path: string
} & RouteConfig

type RoutePropsChildren = PropsWithChildren<BaseRouteProps>

type RoutePropsComponent = BaseRouteProps & {
	component: NonNullable<ReactNode> | null
}

export type RouteProps = RoutePropsChildren | RoutePropsComponent

/**
 * Component that only renders at a certain path.
 *
 * Note: This component mainly uses `useRoute` hook.
 */
const Route: FC<RouteProps> = ({ 
	path: _path, 
	// @ts-expect-error
	children, component, 
	...routeConfig 
}) => {
	const contextValue = useRoute(_path, routeConfig);

	if ( contextValue.match ) {
		return (
			<RouteContext.Provider value={contextValue}>
				{
					children ?? cloneElement(component, {}, children)
				}
			</RouteContext.Provider>
		);
	}

	return null
};

export default Route;
