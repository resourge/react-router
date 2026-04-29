import { forwardRef } from 'react';
import {
	Pressable,
	type StyleProp,
	Text,
	type View,
	type ViewProps,
	type ViewStyle
} from 'react-native';

import { useRouter } from '../../contexts/RouterContext';
import { useLink, type UseLinkProps } from '../../hooks/useLink/useLink.native';
import { type BaseMatchPathProps } from '../../hooks/useMatchPath';

export type LinkProps = BaseMatchPathProps & UseLinkProps & ViewProps
	& {
		matchLink?: (url: URL, linkURL: URL) => boolean
		matchStyle?: StyleProp<ViewStyle>
	};

/**
 * A component that navigates to a specified URL using the `to` prop.
 * 
 * Note: Utilizes the `useLink` hook for navigation and `useMatchRoute` to match the current route.
 */
const Link = forwardRef<View, LinkProps>((
	{ 
		action, 
		children,
		matchLink,
		matchStyle,
		onPress,
		replace,
		style,
		target,
		to,
		...props 
	},
	ref
) => {
	const { url } = useRouter();
	const [linkURL, onClick] = useLink({
		action,
		onPress,
		replace,
		target,
		to
	});
	const isActive = matchLink
		? matchLink(url, linkURL)
		: (linkURL.href === url.href);

	return (
		<Pressable
			{...props}
			onPress={onClick}
			ref={ref}
			style={[style, isActive
				? matchStyle
				: undefined]}
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
