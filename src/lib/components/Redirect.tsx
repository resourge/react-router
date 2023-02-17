import { type FC } from 'react';

import Navigate, { type NavigateProps } from './Navigate';
import Route, { type RouteProps } from './Route';

export type RedirectProps = {
	from: RouteProps['path']
} & NavigateProps & Omit<RouteProps, 'path'>

/**
 * Navigates from `path` to `to`.
 *
 * Note: This component uses the component Route and Navigate.
 */
const Redirect: FC<RedirectProps> = ({ 
	from,
	to, replace,
	...routeProps
}: RedirectProps) => (
	<Route path={from} {...routeProps}>
		<Navigate 
			replace={replace}
			to={to}
		/>
	</Route>
);

export default Redirect;
