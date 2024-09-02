import { useMemo, type FC } from 'react';
import { View } from 'react-native';

import { History } from '@resourge/history-store/mobile';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useUrl } from 'src/lib/hooks/useUrl/useUrl.native';
import { Styles } from 'src/lib/utils/Styles.native';

import { DefaultFallbackContext } from '../../contexts/DefaultFallbackContext';
import { RouterContext } from '../../contexts/RouterContext';
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
	useMemo(() => {
		if ( linking ) {
			History.initial(linking((url) => History.navigate(url)));
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
