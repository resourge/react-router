import {
	cloneElement,
	Suspense,
	type ReactElement,
	type ReactNode
} from 'react'

import { useDefaultFallbackContext } from '../contexts/DefaultFallbackContext';
import { RouteContext } from '../contexts/RouteContext';
import { useMatchRoute, type MatchRouteProps } from '../hooks/useMatchRoute';
import { type MatchResult } from '../utils/matchPath';
import { validateRouteProps } from '../utils/validateRouteProps';

import RouteMetadata from './RouteMetadata';

export type BaseRouteProps = Omit<MatchRouteProps, 'path'> & {
	path?: MatchRouteProps['path']
}

export type RouteProps = BaseRouteProps & { fallback?: ReactNode } & ({
	children: ReactNode
	
	component?: ReactElement
} | ({
	component: ReactElement
	children?: ReactNode
}))

export type IRouteProps = RouteProps & {
	computedMatch?: MatchResult | null
}

/**
 * Component that only renders at a certain path.
 *
 * Note: This component mainly uses `useMatchRoute` hook. And Route without `path` will be treated as normal components.
 */
function Route(props: RouteProps): JSX.Element {
	const {
		children, component,
		computedMatch,
		fallback,
		...matchProps
	} = props as IRouteProps
	if ( __DEV__ ) {
		validateRouteProps(matchProps);
	}
	const defaultFallback = useDefaultFallbackContext()

	const match = useMatchRoute(matchProps as MatchRouteProps, computedMatch)

	if ( match ) {
		const Component = (
			<Suspense fallback={fallback ?? defaultFallback}>
				{ component ? cloneElement(component, {}, component.props.children, children) : children }
				{
					(children as any)?.type?._payload?._result?.default?.routeMetadata 
						? (
							<RouteMetadata metadata={(children as any)?.type?._payload?._result?.default?.routeMetadata} />
						) : <></>
				}
			</Suspense>
		)
		
		if ( match === 'NO_ROUTE' ) {
			return (
				<>
					{ Component }
				</>
			)
		}

		return (
			<RouteContext.Provider value={match}>
				{ Component }
			</RouteContext.Provider>
		)
	}

	return (<></>);
};

export default Route;
