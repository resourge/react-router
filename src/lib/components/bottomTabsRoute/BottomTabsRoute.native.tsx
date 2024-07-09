import TabsRoute, { type TabsRouteProps } from '../tabsRoute/TabsRoute.native';

export type BottomTabsRouteProps = Omit<TabsRouteProps, 'placement'>;

/**
 * Wrapper component for `TabsRoute` that automatically sets the tab placement to `BOTTOM`.
 */

function BottomTabsRoute(props: BottomTabsRouteProps) {
	return (
		<TabsRoute 
			placement="BOTTOM"
			{...props}
		/>
	);
};

BottomTabsRoute.Tab = TabsRoute.Tab;

export default BottomTabsRoute;
