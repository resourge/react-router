import {
	useEffect,
	useMemo,
	useState,
	type FC
} from 'react';
import { View } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Styles } from 'src/lib/utils/Styles.native';
import { History } from 'src/lib/utils/createHistory/createHistory.native';

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
 *
 * Note: This component mainly uses `useUrl` hook from '@resourge/react-search-params'.
 */
const Router: FC<RouterProps> = ({
	children, defaultFallback, linking 
}) => {
	const [{ url, action }, setState] = useState(() => {
		if ( linking ) {
			History.initial(linking((url) => History.navigate(url)));
		}
		
		return History.state;
	});

	useEffect(() => {
		const { remove } = History.addEventListener('URLChange', (current, previous) => {
			if ( current.action !== previous.action || current.url !== previous.url ) {
				setState(Object.assign({}, current));
			}
		});

		return () => {
			remove();
		};
	}, []);

	const value = useMemo(
		() => {
			const history = History.getPreviousHistory();

			return {
				url,
				action,
				previousUrl: history ? history.url : undefined,
				previousAction: history ? history.action : undefined
			};
		}, 
		[url, action]
	);

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
