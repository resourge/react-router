/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./global.d.ts" />

// To remove when URLPattern becomes native
import 'urlpattern-polyfill';

export {
	BrowserRouter, type RouterProps, 
	LanguageRoute, type LanguageRouteProps, Link, type LinkProps, Meta, Navigate, type NavigateProps, Prompt, type PromptProps, Redirect, type RedirectProps, Route, type RouteProps, Switch, type SwitchProps, Title, getLanguageRoute, updateLanguageRoute
} from './components';
export {
	PromptNextContext, RouteContext, type RouteContextObject, RouterContext, type RouterContextType, useLanguageContext, usePromptNext, useRoute, useRouter 
} from './contexts';
export {
	type BaseMatchPathProps, type Blocker, type NavigateOptions, type NavigateTo, type UseLinkProps, type UsePromptProps, useAction, useBeforeURLChange, useBlocker, useLink, useMatchPath, useNavigate, useNormalizeUrl, useParams, usePrompt, useSearchParams, useSwitch,
	type BackNavigateMethod, useBackNavigate
} from './hooks';
export {
	generatePath, matchPath, resolveLocation 
} from './utils';
export { type RouteMetadataType, setRouteMetadata } from './types';
export {
	Param, type PathType, SetupPaths, type SetupPathsResult, path, type SearchParamConfig, searchParam 
} from './setupPaths';
