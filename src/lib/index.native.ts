/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./global.d.ts" />
import { setupURLPolyfill } from 'react-native-url-polyfill';
// To remove when URLPattern becomes native
import 'urlpattern-polyfill';

setupURLPolyfill();

export {
	MobileRouter, type RouterProps, 
	Link, type LinkProps, 
	Navigate, type NavigateProps, 
	Prompt, type PromptProps, 
	Redirect, type RedirectProps, 
	Route, type RouteProps, 
	Switch, type SwitchProps, 
	Header, 
	TabBar, type TabBarProps, type TabBarPropsPlacement, 
	TabBarItem, type TabRouteTabProps, 
	TabsRoute, type TabsRouteProps,
	BottomTabsRoute, type BottomTabsRouteProps,
	TopTabsRoute, type TopTabsRouteProps
} from './components/index.native';
export {
	PromptNextContext, RouteContext, type RouteContextObject, RouterContext, type RouterContextType, useLanguageContext, usePromptNext, useRoute, useRouter 
} from './contexts';
export {
	type BaseMatchPathProps, type Blocker, type NavigateOptions, type NavigateTo, type UseLinkProps, type UsePromptProps, useAction, useBeforeURLChange, useBlocker, useLink, useMatchPath, useNavigate, useNormalizeUrl, useParams, usePrompt, useSearchParams, useSwitch,
	type BackNavigateMethod, useBackNavigate
} from './hooks/index.native';
export {
	generatePath, matchPath, resolveLocation 
} from './utils';
export { type RouteMetadataType, setRouteMetadata } from './types';
export {
	Param, type PathType, SetupPaths, type SetupPathsResult, path, type SearchParamConfig, searchParam 
} from './setupPaths/index.native';
