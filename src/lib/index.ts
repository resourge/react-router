/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./global.d.ts" />

// To remove when URLPattern becomes native
import 'urlpattern-polyfill';

export {
	BrowserRouter, getLanguageRoute, 
	LanguageRoute, type LanguageRouteProps, Link, type LinkProps, Meta, Navigate, type NavigateProps, Prompt, type PromptProps, Redirect, type RedirectProps, Route, type RouteProps, type RouterProps, Switch, type SwitchProps, Title, updateLanguageRoute
} from './components';
export {
	PromptNextContext, RouteContext, type RouteContextObject, RouterContext, type RouterContextType, useLanguageContext, usePromptNext, useRoute, useRouter 
} from './contexts';
export {
	type BackNavigateMethod, type BaseMatchPathProps, type Blocker, type NavigateOptions, type NavigateTo, useAction, useBackNavigate, useBeforeURLChange, useBlocker, useLink, type UseLinkProps, useMatchPath, useNavigate, useNormalizeUrl, useParams, usePrompt, type UsePromptProps,
	useSearchParams, useSwitch
} from './hooks';
export {
	Param, path, type PathType, searchParam, type SearchParamConfig, SetupPaths, type SetupPathsResult 
} from './setupPaths';
export { type RouteMetadataType } from './types';
export { generatePath, matchPath } from './utils';
