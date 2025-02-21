import {
	Children,
	cloneElement,
	isValidElement,
	Suspense,
	type FC,
	type ReactElement,
	type ReactNode
} from 'react';

import { ScreenContainer } from 'react-native-screens';

import { useDefaultFallbackContext } from '../../contexts/DefaultFallbackContext';
import { IsFocusedContext } from '../../contexts/IsFocusedContext';
import { type TabProps } from '../../contexts/TabConfigContext';
import { useSwitch, type UseSwitchProps, type UseSwitchResultMatch } from '../../hooks/useSwitch/useSwitch.native';
import { Styles } from '../../utils/Styles.native';
import { type RouteProps } from '../index.native';

export type SwitchProps = UseSwitchProps & {
	fallback?: ReactNode
};

/**
 * Component that makes sure the first matching path renders.
 *
 * Note: This component mainly uses `useSwitch` hook.
 */
const Switch: FC<SwitchProps> = ({
	children,
	fallback
}: SwitchProps) => {
	const result = useSwitch({
		children 
	});
	const defaultFallback = useDefaultFallbackContext();
	
	if ( isValidElement(result) ) {
		return result;
	}

	return (
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		<Suspense fallback={fallback || defaultFallback}>
			<ScreenContainer
				style={Styles.screen}
			>
				{
					(Children.toArray(children) as Array<ReactElement<RouteProps & TabProps>>)
					.map((child, index) => {
						const isFocused = (result as UseSwitchResultMatch).currentIndex === index;
				
						return (
							<IsFocusedContext.Provider
								key={index}
								value={isFocused}
							>
								{
									cloneElement(
										child, 
										{
											// @ts-expect-error Its for dev only
											_isInsideSwitch: true,
											activityState: isFocused ? 1 : 0,							
											computedMatch: isFocused ? (result as UseSwitchResultMatch).match : null
										}
									)
								}
							</IsFocusedContext.Provider>
						);
					})
				}
			</ScreenContainer>
		</Suspense>
	);
};

export default Switch;
