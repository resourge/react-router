import { setupURLPolyfill } from 'react-native-url-polyfill';

// To remove when URLPattern becomes native
import 'urlpattern-polyfill';

setupURLPolyfill();

export {
	BottomTabsRoute, type BottomTabsRouteProps, 
	Header, Link, 
	type LinkProps, MobileRouter, 
	Navigate, type NavigateProps, 
	Prompt, type PromptProps, 
	Redirect, type RedirectProps, 
	Route, type RouteProps, 
	type RouterProps, 
	Switch, type SwitchProps, TabBar, 
	TabBarItem, type TabBarProps, 
	type TabBarPropsPlacement, type TabRouteTabProps,
	TabsRoute, type TabsRouteProps,
	TopTabsRoute, type TopTabsRouteProps
} from './components/index.native';
export {
	PromptNextContext, RouteContext, type RouteContextObject, RouterContext, type RouterContextType, useLanguageContext, usePromptNext, useRoute, useRouter 
} from './contexts';
export {
	type BackNavigateMethod, type BaseMatchPathProps, type Blocker, type NavigateOptions, type NavigateTo, useAction, useBackNavigate, useBeforeURLChange, useBlocker, useLink, type UseLinkProps, useMatchPath, useNavigate, useNormalizeUrl, useParams, usePrompt, type UsePromptProps,
	useSearchParams, useSwitch
} from './hooks/index.native';
export {
	Param, path, type PathType, searchParam, type SearchParamConfig, SetupPaths, type SetupPathsResult 
} from './setupPaths/index.native';
export { type RouteMetadataType } from './types';
export { generatePath, matchPath } from './utils';
