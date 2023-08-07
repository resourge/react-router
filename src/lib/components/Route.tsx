import {
	cloneElement,
	Suspense,
	type FC,
	type ReactElement,
	type ReactNode
} from 'react'

import { RouteContext } from '../contexts/RouteContext';
import { useMatchRoute, type MatchRouteProps } from '../hooks/useMatchRoute';
import { type MatchResult } from '../utils/matchPath';
import { validateRouteProps } from '../utils/validateRouteProps';

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
const Route: FC<RouteProps> = ({
	children, component,
	computedMatch,
	fallback,
	...matchProps
}: IRouteProps) => {
	validateRouteProps(matchProps);

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const match = useMatchRoute(matchProps as MatchRouteProps, computedMatch)

	if ( match ) {
		const Component = component ? cloneElement(component, {}, component.props.children, children) : children;
		
		if ( match === 'NO_ROUTE' ) {
			return (
				<Suspense fallback={fallback}>
					{ Component }
				</Suspense>
			)
		}

		return (
			<RouteContext.Provider value={match}>
				<Suspense fallback={fallback}>
					{ Component }
				</Suspense>
			</RouteContext.Provider>
		)
	}

	return null;
};

export default Route;
