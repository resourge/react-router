import { type FC, useMemo } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { History, HistoryStore } from '@resourge/history-store/mobile';

import { DefaultFallbackContext } from '../../contexts/DefaultFallbackContext';
import { RouterContext } from '../../contexts/RouterContext';
import { useUrl } from '../../hooks/useUrl/useUrl.native';
import { Styles } from '../../utils/Styles.native';
import HeaderConfig from '../headerConfig/HeaderConfig.native';

import { type BaseRouterProps } from './RouterPropsType';

export type RouterProps = BaseRouterProps & {
	/**
	 * For custom navigation (ex: notifications)
	 * @param listener - listener for url changes  
	 * @platform native
	 */
	linking?: (listener: (url: string) => void) => string
};

/**
 * First component that creates the context for the rest of the children.
 */
const Router: FC<RouterProps> = ({
	children, defaultFallback, linking 
}) => {
	// eslint-disable-next-line react-hooks/void-use-memo
	useMemo(() => {
		if ( linking ) {
			History.initial(linking((url) => History.navigate(url)));
			// @ts-expect-error Its necessary to make sure initial is on par
			// eslint-disable-next-line react-hooks/immutability
			HistoryStore.value[0] = History.state.url;
		}
	}, []);
	
	const value = useUrl();

	return (
		<SafeAreaProvider>
			<RouterContext.Provider 
				value={value}
			>
				<DefaultFallbackContext.Provider 
					value={defaultFallback}
				>
					<View
						style={Styles.screen}
					>
						<HeaderConfig />
						{ children }
					</View>
				</DefaultFallbackContext.Provider>
			</RouterContext.Provider>
		</SafeAreaProvider>
	);
};
export default Router;
