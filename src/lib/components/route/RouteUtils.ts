import { type ReactNode } from 'react';

import { useMatchPath, type MatchPathProps } from 'src/lib/hooks/useMatchPath';
import { type MatchResult } from 'src/lib/utils/matchPath';
import { validateRouteProps } from 'src/lib/utils/validateRouteProps';

export type BaseRouteProps = Omit<MatchPathProps, 'path'> & {
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

	// eslint-disable-next-line react-hooks/rules-of-hooks
	return matchProps.path === undefined ? 'NO_ROUTE' : useMatchPath(matchProps as MatchPathProps, computedMatch);
}
