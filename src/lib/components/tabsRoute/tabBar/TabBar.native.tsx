import { type FC, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

export type TabBarProps = { 
	children: ReactNode
	placement: TabBarPropsPlacement
};

export type TabBarPropsPlacement = 'BOTTOM' | 'TOP';

const TabBar: FC<TabBarProps> = ({ children, placement }: TabBarProps) => {
	return (
		<View
			accessibilityRole={'tablist'}
			style={[
				styles.tabBar, 
				{ 
					borderBottomWidth: placement === 'TOP'
						? StyleSheet.hairlineWidth
						: 0,
					borderTopWidth: placement === 'BOTTOM'
						? StyleSheet.hairlineWidth
						: 0
				}
			]}
		>
			{ children }
		</View>
	);
};

export default TabBar;

const styles = StyleSheet.create({
	tabBar: {
		borderColor: '#bbb',
		flexDirection: 'row',
		gap: 10,
		justifyContent: 'space-around'
	}
});
