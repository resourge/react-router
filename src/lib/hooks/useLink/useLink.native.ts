import { type AnchorHTMLAttributes } from 'react';
import {
	Alert,
	type GestureResponderEvent,
	Linking,
	type PressableProps
} from 'react-native';

import { type NavigateOptions } from '@resourge/history-store/mobile';

import { ORIGIN } from '../../utils/constants';
import { useNavigate } from '../useNavigate/useNavigate.native';
import { useNormalizeUrl } from '../useNormalizeUrl/useNormalizeUrl.native';
import { type NavigateTo } from '../useNormalizeUrl/useNormalizeUrlUtils';

export type UseLinkProps = NavigateOptions 
	& {
		onPress?: PressableProps['onPress']
		target?: AnchorHTMLAttributes<HTMLAnchorElement>['target']
		to: NavigateTo
	};

/**
 * Hook that returns 'href' and onClick method to navigate to link
 */
export const useLink = ({
	action, onPress, replace, target, to
}: UseLinkProps) => {
	const navigate = useNavigate();
	const normalizeUrl = useNormalizeUrl();

	const url = normalizeUrl(to);

	const onNewClick = (event: GestureResponderEvent) => {
		try {
			// Call custom onPress handler if provided
			onPress?.(event);
		}
		catch (error) {
			event.preventDefault();
			throw error;
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
					if (supported) {
						Linking.openURL(url.href);
					}
					else {
						Alert.alert(`Don't know how to open URI: ${url.href}`);
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

	return [url, onNewClick] as const;
};
