import {
	Children,
	useMemo,
	type LegacyRef,
	type PropsWithChildren,
	type ReactElement,
	type ReactNode
} from 'react';
import { View } from 'react-native';

import { TabConfigContext, type TabProps } from 'src/lib/contexts/TabConfigContext';
import { Styles } from 'src/lib/utils/Styles.native';

import Route, { type RouteProps } from '../route/Route.native';
import Switch from '../switch/Switch.native';

import TabBar, { type TabBarPropsPlacement } from './tabBar/TabBar.native';
import TabBarItemContainer, { type CommonTabProps, type TabBarItemContainerProps } from './tabBarItemContainer/TabBarItemContainer.native';

export type TabsRouteProps = PropsWithChildren & { 
	placement: TabBarPropsPlacement
	renderTabBar?: (
		props: {
			children: Array<ReactElement<TabRouteTabProps>>
			placement: TabBarPropsPlacement
			tabs: TabRouteTabProps[]
		}
	) => ReactNode
} 
& TabProps
& CommonTabProps;

export type TabRouteTabProps = Omit<RouteProps, 'path'> & { 
	label: string
	path: string
} 
& TabProps
& CommonTabProps;

/**
 * `TabsRoute` provides a customizable tab navigation component. 
 * It includes functionalities to render tabs and switch between different views seamlessly. 
 * Supports customizable tab bars and can accommodate various configurations based on user requirements.
 */
function TabsRoute(
	{
		children, placement, historyMode, 
		onPress,
		renderLabel,
		renderTabBarItem,
		renderTabBar = ({ placement, children }) => (
			<TabBar
				placement={placement}
			>
				{ children }
			</TabBar>
		),
		animated,
		duration
	}: TabsRouteProps
) {
	const childs = Children.toArray(children) as Array<ReactElement<TabBarItemContainerProps> & { ref?: LegacyRef<any> }>;

	const Screens = (
		<Switch>
			{ children as any }
		</Switch>
	);

	const isTop = placement === 'TOP';

	const value = useMemo(() => ({
		historyMode
	}), [historyMode]);

	return (
		<TabConfigContext.Provider value={value}>
			<View
				style={Styles.screen}
			>
				{
					!isTop ? Screens : (<></>)
				}
				{
					renderTabBar({
						placement,
						get children() {
							return childs
							.map(({ props }) => {
								const path = props.path;

								return (
									<TabBarItemContainer
										key={path}
										animated={props.animated ?? animated}
										duration={props.duration ?? duration}
										icon={props.icon}
										label={props.label}
										path={path}
										renderLabel={(props.renderLabel ?? renderLabel)}
										renderTabBarItem={props.renderTabBarItem ?? renderTabBarItem}
										onPress={props.onPress ?? onPress}
									/>
								);
							});
						},
						get tabs() {
							return childs.map(({ props }) => props);
						}
					})
				}
				{
					isTop ? Screens : (<></>)
				}
			</View>
		</TabConfigContext.Provider>
	);
}

TabsRoute.Tab = Route as (props: TabRouteTabProps) => JSX.Element;

export default TabsRoute;
