import {
	cloneElement,
	type FC,
	type ReactElement,
	type ReactNode
} from 'react'

import { RouteContext } from '../contexts/RouteContext';
import { type MatchPropsRoute, useMatchRoute } from '../hooks/useMatchRoute';
import { type MatchResult } from '../utils/matchPath';
import { validateRouteProps } from '../utils/validateRouteProps';

export type BaseRouteProps = MatchPropsRoute

export type RouteProps = BaseRouteProps & ({
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
 * Note: This component mainly uses `useMatchRoute` hook.
 */
const Route: FC<RouteProps> = ({
	children, component,
	computedMatch,

	...matchProps
}: IRouteProps) => {
	validateRouteProps(matchProps);

	const match = useMatchRoute(matchProps, computedMatch)

	if ( match ) {
		return (
			<RouteContext.Provider value={match}>
				{ component ? cloneElement(component, {}, component.props.children, children) : children }
			</RouteContext.Provider>
		)
	}

	return null;
};

export default Route;
