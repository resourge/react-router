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
 * Component extends element `a` and navigates to `to`.
 * 
 * Note: This component mainly uses `useLink` hook to navigate to `to` and `useMatchRoute` to match route.
 */
const Link = forwardRef<View, LinkProps>((
	props,
	ref
) => {
	const { 
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		to, 
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		replace,

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		exact,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		hash,
		
		style,
		matchStyle,
		children,
		...aProps 
	} = props;
	const { url } = useRouter();
	const [href, onClick] = useLink(props);
	const match = href === url.href;

	return (
		<Pressable
			{...aProps}
			ref={ref}
			style={[style, match ? matchStyle : undefined]}
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
