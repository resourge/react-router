import { type AnchorHTMLAttributes } from 'react';
import {
	Alert,
	Linking,
	type GestureResponderEvent,
	type PressableProps
} from 'react-native';

import { type NavigateOptions } from '@resourge/history-store/mobile';

import { ORIGIN } from 'src/lib/utils/constants';

import { useNavigate } from '../useNavigate/useNavigate.native';
import { useNormalizeUrl } from '../useNormalizeUrl/useNormalizeUrl.native';
import { type NavigateTo } from '../useNormalizeUrl/useNormalizeUrlUtils';

export type UseLinkProps = {
	to: NavigateTo
	onPress?: PressableProps['onPress']
	target?: AnchorHTMLAttributes<HTMLAnchorElement>['target']
} 
& NavigateOptions;

/**
 * Hook that returns 'href' and onClick method to navigate to link
 */
export const useLink = ({
	to, replace, action, onPress, target
}: UseLinkProps) => {
	const navigate = useNavigate();
	const normalizeUrl = useNormalizeUrl();

	const url = normalizeUrl(to);

	const onNewClick = (event: GestureResponderEvent) => {
		try {
			if (onPress) onPress(event);
		}
		catch (ex) {
			event.preventDefault();
			// eslint-disable-next-line @typescript-eslint/only-throw-error
			throw ex;
		}

		if (
			!event.defaultPrevented 
			&& (
				!target || target === '_self'
			)
		) {
			event.preventDefault();

			if ( url.origin !== ORIGIN ) {
				Linking.canOpenURL(url.href)
				.then((supported) => {
					if (!supported) {
						Alert.alert(`Don't know how to open URI: ${url.href}`);
					}
					else {
						Linking.openURL(url.href);
					}
				});
				return; 
			}

			navigate(
				url, 
				{
					action,
					replace
				}
			);
		}
	};

	return [url.href, onNewClick] as const;
};
