import {
	cloneElement,
	FC,
	ReactElement,
	ReactNode
} from 'react'

import { RouteContext } from '../contexts/RouteContext';
import { UseSearchRouteProps, useSearchRoute } from '../hooks/useSearchRoute';
import { MatchResult } from '../utils/matchPath';

export type BaseSearchRouteProps = UseSearchRouteProps

export type SearchRouteProps = BaseSearchRouteProps & ({
	children: ReactNode
	component?: ReactElement
})

export type ISearchRouteProps = SearchRouteProps & {
	computedMatch?: MatchResult | null
}

/**
 * Component that only renders at a certain `search`.
 *
 * Note: This component mainly uses `useSearchRoute` hook.
 */
const SearchRoute: FC<SearchRouteProps> = ({
	children, component,
	computedMatch,

	...matchProps
}: ISearchRouteProps) => {
	const match = useSearchRoute(matchProps, computedMatch)

	if ( match ) {
		return (
			<RouteContext.Provider value={match}>
				{ component ? cloneElement(component, {}, children) : children }
			</RouteContext.Provider>
		)
	}

	return null;
};

export default SearchRoute;
