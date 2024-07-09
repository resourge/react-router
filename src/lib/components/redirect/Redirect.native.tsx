import { type FC } from 'react';

import Navigate, { type NavigateProps } from '../navigate/Navigate.native';
import Route, { type RouteProps } from '../route/Route.native';
import { useRouteMatch } from '../route/RouteUtils';

export type RedirectProps = {
	from: RouteProps['path']
} & NavigateProps & Omit<RouteProps, 'path'>;

/**
 * Navigates from `path` to `to`.
 *
 * Note: This component uses the component Route and Navigate.
 */
const Redirect: FC<RedirectProps> = ({ 
	from,
	to, replace,
	...routeProps
}: RedirectProps) => {
	const match = useRouteMatch({
		...routeProps,
		path: from
	});

	if ( !match ) {
		return (<></>);
	}

	return (
		<Route
			path={from}
			{...routeProps}
		>
			<Navigate 
				replace={replace}
				to={to}
			/>
		</Route>
	);
};

export default Redirect;
