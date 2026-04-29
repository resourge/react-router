import { type FC } from 'react';

import Navigate, { type NavigateProps } from '../navigate/Navigate';
import Route, { type RouteProps } from '../route/Route';

export type RedirectProps = NavigateProps & Omit<RouteProps, 'path'> & {
	from: RouteProps['path']
};

/**
 * Navigates from `path` to `to`.
 *
 * Note: This component uses the component Route and Navigate.
 */
const Redirect: FC<RedirectProps> = ({ 
	from,
	replace, to,
	...routeProps
}: RedirectProps) => (
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

export default Redirect;
