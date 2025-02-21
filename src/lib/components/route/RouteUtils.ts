import { type ReactNode } from 'react';

import { useMatchPath, type MatchPathProps } from '../../hooks/useMatchPath';
import { type MatchResult } from '../../utils/matchPath';
import { validateRouteProps } from '../../utils/validateRouteProps';

export type BaseRouteProps = Omit<MatchPathProps, 'path'> & {
	/**
	 * @default false
	 */
	index?: boolean
	path?: MatchPathProps['path']
};

export type BasicRouteProps = BaseRouteProps & { 
	children?: ReactNode
	fallback?: ReactNode
};

export type IRouteProps = BasicRouteProps & {
	computedMatch?: MatchResult | null
};

export function useRouteMatch(props: BasicRouteProps) {
	const {
		computedMatch,
		...matchProps
	} = props as IRouteProps;
	if ( process.env.NODE_ENV === 'development' ) {
		validateRouteProps(matchProps);
	}

	return matchProps.path === undefined 
		? 'NO_ROUTE' 
		// eslint-disable-next-line react-hooks/rules-of-hooks
		: useMatchPath(matchProps as MatchPathProps, computedMatch);
}
