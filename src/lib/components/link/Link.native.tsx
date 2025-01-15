import { forwardRef } from 'react';
import {
	Pressable,
	Text,
	type StyleProp,
	type View,
	type ViewProps,
	type ViewStyle
} from 'react-native';

import { useRouter } from '../../contexts/RouterContext';
import { useLink, type UseLinkProps } from '../../hooks/useLink/useLink.native';
import { type BaseMatchPathProps } from '../../hooks/useMatchPath';

export type LinkProps = UseLinkProps & {
	matchStyle?: StyleProp<ViewStyle>
} & BaseMatchPathProps
& ViewProps;

/**
 * A component that navigates to a specified URL using the `to` prop.
 * 
 * Note: Utilizes the `useLink` hook for navigation and `useMatchRoute` to match the current route.
 */
const Link = forwardRef<View, LinkProps>((
	{ 
		to, 
		replace,
		style,
		matchStyle,
		children,
		action,
		onPress,
		target,
		...props 
	},
	ref
) => {
	const { url } = useRouter();
	const [href, onClick] = useLink({
		to, replace, action, onPress, target
	});
	const isActive = href === url.href;

	return (
		<Pressable
			{...props}
			ref={ref}
			style={[style, isActive ? matchStyle : undefined]}
			onPress={onClick}
		>
			{ 
				typeof children === 'string' 
					? <Text>{ children }</Text> 
					: children 
			}
		</Pressable>
	);
});

Link.displayName = 'Link';

export default Link;
