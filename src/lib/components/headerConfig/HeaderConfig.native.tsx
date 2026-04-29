import { useEffect, useState } from 'react';
import {
	type FlexStyle,
	StyleSheet,
	Text,
	View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { type HeaderProps, type HeaderTitlePlacement } from '../header/Header.native';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export let HeaderConfigEvent = (_props: HeaderProps) => {};

const PLACEMENTS: { [key in HeaderTitlePlacement]: FlexStyle['justifyContent'] } = {
	center: 'center',
	left: 'flex-start',
	right: 'flex-end'
};

const getTitlePlacement = (placement?: HeaderTitlePlacement) => PLACEMENTS[placement ?? 'center'];

const HeaderConfig = () => {
	const { top } = useSafeAreaInsets();
	const [props, setShowHeader] = useState<HeaderProps | undefined>();

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
			style={[
				Styles.container,
				{
					justifyContent: getTitlePlacement(props.titlePlacement), 
					marginTop: top 
				}
			]}
		>
			{
				props.title
					? (
						<Text
							accessibilityRole={'header'}
							style={Styles.text}
						>
							{ props.title }
						</Text>
					)
					: (<></>)
			}
			{ props.children }
		</View>
	);
};

const Styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		flexDirection: 'row'
	},
	text: {
		fontSize: 17,
		fontWeight: 'bold',
		margin: 16
	}
});

export default HeaderConfig;
