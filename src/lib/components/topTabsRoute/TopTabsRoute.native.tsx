import TabsRoute, { type TabsRouteProps } from '../tabsRoute/TabsRoute.native';

export type TopTabsRouteProps = Omit<TabsRouteProps, 'placement'>;

/**
 * Wrapper component for `TabsRoute` that automatically sets the tab placement to `TOP`.
 */
function TopTabsRoute(props: TopTabsRouteProps) {
	return (
		<TabsRoute 
			placement="TOP"
			{...props}
		/>
	);
};

TopTabsRoute.Tab = TabsRoute.Tab;

export default TopTabsRoute;
