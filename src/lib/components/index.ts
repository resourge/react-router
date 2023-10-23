import BrowserRouter from './BrowserRouter';
import type { BrowserRouterProps } from './BrowserRouter';
import LanguageRoute, { updateLanguageRoute, getLanguageRoute } from './LanguageRoute';
import type { LanguageRouteProps } from './LanguageRoute';
import Link from './Link';
import type { LinkProps } from './Link';
import Navigate from './Navigate';
import type { NavigateProps } from './Navigate';
import Prompt from './Prompt';
import type { PromptProps } from './Prompt';
import Redirect from './Redirect';
import type { RedirectProps } from './Redirect';
import Route from './Route';
import type { RouteProps } from './Route';
import Switch from './Switch';
import type { SwitchProps } from './Switch';

export {
	Link,
	type LinkProps,

	Navigate,
	type NavigateProps,

	Prompt,
	type PromptProps,

	Redirect,
	type RedirectProps,

	Route,
	type RouteProps,

	BrowserRouter,
	type BrowserRouterProps,

	Switch,
	type SwitchProps,

	updateLanguageRoute,
	getLanguageRoute,
	LanguageRoute,
	type LanguageRouteProps
};
