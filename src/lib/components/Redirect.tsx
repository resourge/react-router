import { VFC } from 'react';

import Navigate from './Navigate';
import Route, { RouteProps } from './Route'

export type RedirectProps = {
	to: string
} & Omit<RouteProps, 'children' | 'component'>

/**
 * Navigates from `path` to `to`.
 *
 * Note: This component uses component Route and Navigate.
 */
const Redirect: VFC<RedirectProps> = ({ to, ...routeProps }) => (
	<Route {...routeProps}>
		<Navigate to={to} />
	</Route>
);

export default Redirect;
