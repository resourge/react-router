import { useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	type FlexStyle
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { type HeaderProps, type HeaderTitlePlacement } from '../header/Header.native';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export let HeaderConfigEvent = (_props: HeaderProps) => {};

function getTitlePlacement(placement?: HeaderTitlePlacement): FlexStyle['justifyContent'] {
	switch ( placement ) {
		case 'left':
			return 'flex-start';
		case 'right':
			return 'flex-end';
		default:
			return 'center';
	}
}

const HeaderConfig = () => {
	const { top } = useSafeAreaInsets();
	const [props, setShowHeader] = useState<HeaderProps | undefined>(undefined);

	useEffect(() => {
		HeaderConfigEvent = (props: HeaderProps) => {
			setShowHeader(props);
		};
	}, []);

	if ( !props ) {
		return (<></>);
	}

	return (
		<View
			style={{
				marginTop: top,
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: getTitlePlacement(props.titlePlacement)
			}}
		>
			{
				props.title
					? (
						<Text
							accessibilityRole="header"
							style={Styles.text}
						>
							{ props.title }
						</Text>
					) : (<></>)
			}
			{ props.children }
		</View>
	);
};

const Styles = StyleSheet.create({
	text: {
		fontSize: 17,
		fontWeight: 'bold',
		margin: 16
	}
});

export default HeaderConfig;
