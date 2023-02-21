/**
 * react-router vundefined
 *
 * Copyright (c) resourge.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
import React, { ReactNode, ReactElement, FC, PropsWithChildren, AnchorHTMLAttributes, MouseEvent } from 'react';
import { ActionType, EVENTS, BeforeUrlChangeEvent } from '@resourge/react-search-params';

type UrlPattern = {
    path: string;
    baseURL?: string;
    /**
     * @default false
     */
    exact?: boolean;
    hash?: boolean;
    hashPath?: string;
};

type MatchProps = UrlPattern;
type MatchResult<Params extends Record<string, string> = Record<string, string>> = {
    /**
     * Current {@link URLPatternResult}
     */
    match: URLPatternResult;
    /**
     * Current route params
     */
    params: Params;
    /**
     * Current route path (merged with previous path's)
     */
    path: string;
    /**
     * Unique id for route. (prevents routes from rendering again if nothing changed)
     */
    unique: string;
    /**
     * Current route URL
     */
    url: URL;
    /**
     * Current {@link URLPattern}
     */
    urlPattern: URLPattern;
    /**
     * If current route is hashed
     */
    hash?: boolean;
    /**
     * Hash path
     */
    hashPath?: string;
};
/**
 * Method to match href to {@link MatchProps path}
 * @param href {string}
 * @param matchProps {@link MatchProps} - props to define the route
 */
export declare const matchPath: <Params extends Record<string, string> = Record<string, string>>(href: string, matchProps: MatchProps) => MatchResult<Params> | null;

type MatchRouteProps = {
    /**
     * Route path(s)
     * @default '*'
     */
    path: string | string[];
    /**
     * Makes it so 'URL' needs to be exactly as the path
     * @default false
     */
    exact?: boolean;
    /**
     * Turn 'route' into 'hash route'
     * @default false
     */
    hash?: boolean;
};
/**
 * Method to match `url` to `url`
 *
 * @param url {URL} - Current url.
 * @param matchRoute {MatchRouteProps}
 * @param parentRoute {MatchResult} - Current route parent.
 */
export declare const matchRoute: (url: URL, { path, hash, exact }: MatchRouteProps, parentRoute: MatchResult | undefined) => MatchResult<Record<string, string>> | null;
/**
 * Hook to match path to current `url`.
 * @returns null if it is a no match, otherwise returns {@link MatchResult}
 */
export declare const useMatchRoute: (matchProps: MatchRouteProps, matchResult?: MatchResult | null) => MatchResult<Record<string, string>> | null;

type BaseRouteProps = Omit<MatchRouteProps, 'path'> & {
    path?: MatchRouteProps['path'];
};
type RouteProps = BaseRouteProps & ({
    children: ReactNode;
    component?: ReactElement;
} | ({
    component: ReactElement;
    children?: ReactNode;
}));
/**
 * Component that only renders at a certain path.
 *
 * Note: This component mainly uses `useMatchRoute` hook. And Route without `path` will be treated as normal components.
 */
export declare const Route: FC<RouteProps>;

type BrowserRouterProps = PropsWithChildren<{
    base?: string;
} & Omit<BaseRouteProps, 'path'>>;
/**
 * First component that creates the context for the rest of the children.
 *
 * Note: This component mainly uses `useUrl` hook from '@resourge/react-search-params'.
 */
export declare const BrowserRouter: FC<BrowserRouterProps>;

type NavigateURL = Pick<Partial<URL>, 'pathname' | 'hash' | 'search'>;
type NavigateParams = {
    params: Record<string, any>;
};
type NavigateObject = NavigateURL | NavigateParams;
type NavigateTo = string | URL | NavigateObject | ((url: URL, routeUrl: URL) => string | URL | NavigateObject);
/**
 * Returns a method for making a url from `to`.
 */
export declare const useNormalizeUrl: () => (to: NavigateTo) => URL;

type NavigateOptions = {
    /**
     * A way to specify the action
     * @default false
     */
    action?: Exclude<ActionType, 'initial'>;
    /**
     * Replaces path instead of push
     * @default false
     */
    replace?: boolean;
};
/**
 * Returns a method for navigation `to`.
 */
export declare const useNavigate: () => (to: NavigateTo, options?: NavigateOptions) => void;

type UseLinkProps = {
    to: NavigateTo;
} & NavigateOptions & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;
/**
 * Hook that returns 'href' and onClick method to navigate to link
 */
export declare const useLink: ({ to, replace, ...aProps }: UseLinkProps) => readonly [string, (event: MouseEvent<HTMLAnchorElement>) => void];

type LinkProps = UseLinkProps & {
    matchClassName?: string;
} & Omit<MatchRouteProps, 'path'>;
/**
 * Component extends element `a` and navigates to `to`.
 *
 * Note: This component mainly uses `useLink` hook to navigate to `to` and `useMatchRoute` to match route.
 */
export declare const Link: React.ForwardRefExoticComponent<{
    to: NavigateTo;
} & NavigateOptions & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    matchClassName?: string | undefined;
} & Omit<MatchRouteProps, "path"> & React.RefAttributes<HTMLAnchorElement>>;

type NavigateProps = {
    to: NavigateTo;
} & NavigateOptions;
/**
 * Navigates to `to`.
 *
 * Note: This component mainly uses `useNavigate` hook to navigate to `to`.
 */
export declare const Navigate: FC<NavigateProps>;

type Blocker = (routeUrl: URL, url: URL, action: typeof EVENTS[keyof typeof EVENTS]) => boolean;
type BlockerResult = {
    continueNavigation: () => void;
    finishBlocking: () => void;
    isBlocking: boolean;
};
/**
 * Fires before the route change, and serves to block or not the current route.
 * @param blocker {Blocker}
 * @returns blockerResult {BlockerResult}
 */
export declare const useBlocker: (blocker: Blocker) => BlockerResult;

type UsePromptProps = {
    /**
     * When true blocks url change
     */
    when: boolean | Blocker;
    message?: string | ((routeUrl: URL, url: URL, action: typeof EVENTS[keyof typeof EVENTS]) => string);
};
/**
 * @param when When `true` it will prompt the user
 * 	before navigating away from a screen.
 *  (accepts method that return's boolean).
 * @param message When set, will prompt the user with native `confirm` and message.
 * 	When `undefined` will wait `[1]` method to be called
 * @returns promptResult {BlockerResult}
 */
export declare const usePrompt: ({ when, message }: UsePromptProps) => BlockerResult;

type PromptProps = {
    children?: ReactNode;
} & UsePromptProps;
/**
 * Component for prompting the user before navigating.
 *
 * * Note: This component mainly uses `usePrompt` hook.
 */
export declare const Prompt: FC<PromptProps>;

type RedirectProps = {
    from: RouteProps['path'];
} & NavigateProps & Omit<RouteProps, 'path'>;
/**
 * Navigates from `path` to `to`.
 *
 * Note: This component uses the component Route and Navigate.
 */
export declare const Redirect: FC<RedirectProps>;

type UseSearchRouteProps = {
    /**
     * Route search
     */
    search: string | string[];
} & Omit<MatchRouteProps, 'path'>;
/**
 * Hook to match search(s) to current `url`.
 * @returns null if it is a no match, otherwise returns {@link MatchResult}
 */
export declare const useSearchRoute: (matchSearchProps: UseSearchRouteProps, computedMatch?: MatchResult | null) => MatchResult<Record<string, string>> | null;

type BaseSearchRouteProps = UseSearchRouteProps;
type SearchRouteProps = BaseSearchRouteProps & ({
    children: ReactNode;
    component?: ReactElement;
});
/**
 * Component that only renders at a certain `search`.
 *
 * Note: This component mainly uses `useSearchRoute` hook.
 */
export declare const SearchRoute: FC<SearchRouteProps>;

type SwitchProps = {
    children: Array<ReactElement<BaseRouteProps>> | ReactElement<BaseRouteProps>;
};
/**
 * Component that makes sure the first matching path renders.
 *
 * Note: This component mainly uses `useSwitch` hook.
 */
export declare const Switch: FC<SwitchProps>;

export declare const PromptNextContext: React.Context<BlockerResult | null>;
/**
 * To use inside Prompt components.
 * Contains the `next` method to navigate after "Prompt" is finished.
 */
export declare const usePromptNext: () => BlockerResult;

type RouteContextObject<Params extends Record<string, string> = Record<string, string>> = MatchResult<Params>;
export declare const RouteContext: React.Context<RouteContextObject<Record<string, string>> | null>;
/**
 * Hook to access first parent 'Route'.
 */
export declare const useRoute: <Params extends Record<string, string> = Record<string, string>>() => RouteContextObject<Params>;

type RouterContextType = {
    action: ActionType;
    url: URL;
};
export declare const RouterContext: React.Context<RouterContextType>;
/**
 * Hook to access to current URL
 */
export declare const useRouter: () => RouterContextType;

/**
 * Hook to access action that lead to the current `URL`.
 */
export declare const useAction: () => ActionType;

/**
 * Fires before the route changes.
 * @param beforeURLChange
 *  If result:
 * 		`true` routing will occur normally
 *  	`false` will prevent route from changing
 */
export declare const useBeforeURLChange: (beforeURLChange: (event: BeforeUrlChangeEvent) => boolean) => void;

type StringifyObjectParams<T extends Record<string, any>> = {
    [Key in keyof T]: string;
};

type TransformParams<Params extends Record<string, string> = Record<string, string>> = (params: StringifyObjectParams<Params>) => Params;
/**
 * Returns the current route params
 *
 * @param transformsParams Method to transform the params
 */
export declare const useParams: <Params extends Record<string, string> = Record<string, string>>(transformsParams?: TransformParams<Params>) => Params;

/**
 * Returns the current search parameters and a method to change
 * @param defaultParams {T}
 */
export declare const useSearchParams: <T extends Record<string, any>>(defaultParams?: T | undefined) => readonly [T, (newParams: Partial<T>) => void];

type Props = BaseRouteProps | BaseSearchRouteProps | RedirectProps | NavigateProps;
/**
 * Returns the first children component with props `path`, `search`, `to/from` that matches the current location or without previous props.
 */
export declare const useSwitch: (children: Array<ReactElement<Props>> | ReactElement<Props>) => ReactElement<BaseRouteProps> | null;

/**
 * Converter param's of path into there respective value.
 * @param path {string}
 * @param params {T} Object containing key and values of path params
 * @returns
 */
export declare function generatePath<T extends Record<string, any>>(path: string, params: T): string;

/**
 * Method to resolve `URL`'s
 *  Ex:
 * baseUrl: /home/dashboard
 *
 * url: "/home" // /home
 * url: "home" // /home/dashboard/home
 * url: "about" // /home/dashboard/about
 * url: "./about" // /home/dashboard/about
 * url: "/about" // /about
 * url: "../contact" // /home/contact
 * url: "../../products" // /products
 * url: "../../../products" // /products
 */
export declare function resolveLocation(url: string, _baseURL?: string): URL;

type ParamsConfigOptional<ParamResult = any, BeforePath = ParamResult> = {
    /**
     * Makes param optional
     */
    optional: true;
    /**
     * Transforms param before path creation (get).
     */
    beforePath?: (value: BeforePath) => string | BeforePath;
    /**
     * Transform's param on useParam.
     */
    transform?: (value?: string) => ParamResult | undefined;
};
type ParamsConfigNotOptional<ParamResult = any, BeforePath = ParamResult> = {
    /**
     * Transforms param before path creation (get).
     */
    beforePath?: (value: BeforePath) => string | BeforePath;
    /**
     * Makes param optional
     */
    optional?: false | undefined;
    /**
     * Transform's param on useParam.
     */
    transform?: (value: string) => ParamResult;
};
type ParamsConfig<ParamResult = any, BeforePath = ParamResult> = ParamsConfigNotOptional<ParamResult, BeforePath> | ParamsConfigOptional<ParamResult, BeforePath>;
export declare class ParamPath<Key = any, Params = any, UseParams = Params, IsOptional = false> {
    key: Key;
    param: string;
    config?: IsOptional extends true ? ParamsConfigOptional<UseParams, Params> : ParamsConfigNotOptional<UseParams, Params>;
}
export declare const Param: <K extends string = string, Params extends unknown = string, UseParams = Params, IsOptional extends boolean = false>(param: K, config?: (ParamsConfig<UseParams extends Params ? Params : UseParams, Params> & {
    optional?: IsOptional | undefined;
}) | undefined) => ParamPath<K, Params, UseParams, IsOptional extends true ? false : true>;

type RemoveUndefined<T extends Record<string, any> | undefined> = {
    [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};
type IsAllOptional<T extends Record<string, any> | undefined> = keyof RemoveUndefined<T> extends never ? true : false;
type CleanObject<X extends Record<string, any>> = {
    [K in keyof X as string extends K ? never : K]: X[K];
};
type CleanObjects<X extends Record<string, any>, Y extends Record<string, any>> = CleanObject<{
    [K in keyof X as string extends K ? never : K]: X[K];
} & {
    [K in keyof Y as string extends K ? never : K]: Y[K];
}>;

type PathType<Routes extends Record<string, Path<any, any, any>>, Params extends Record<string, any> | undefined = undefined, UseParams extends Record<string, any> | undefined = undefined> = {
    /**
     * Method to obtain the true path.
     * Calling it with `params` will replace the params with the params value on the path.
     */
    get: Params extends undefined ? (() => string) : IsAllOptional<Params> extends true ? (((params?: Params) => string)) : (params: Params) => string;
    /**
     * Generated string from chain functions. Includes path with `params`.
     */
    path: string;
} & InjectParamsIntoPathType<Routes, Params, UseParams> & (IsAllOptional<UseParams> extends false ? {
    /**
     * Hook to receive the params related to the route.
     * Here all the transform method will transform the params to the desired params.
     */
    useParams: () => UseParams;
} : (undefined extends UseParams ? {} : {
    /**
     * Hook to receive the params related to the route.
     * Here all the transform method will transform the params to the desired params.
     */
    useParams: () => UseParams;
}));
type InjectParamsIntoPathType<Paths extends Record<string, Path<any, any, any>>, Params extends Record<string, any> | undefined = undefined, UseParams extends Record<string, any> | undefined = undefined> = {
	// @ts-expect-error Want to protect value, but also access it with types
    [K in keyof Paths]: PathType<Paths[K]['_routes'], Paths[K]['_params'] & Params, Paths[K]['_useParams'] & UseParams>;
};
type InjectParamsIntoPath<Params extends Record<string, any>, UseParams extends Record<string, any>, Paths extends Record<string, Path<any, any, any>>> = string extends keyof Params ? Paths : {
	// @ts-expect-error Want to protect value, but also access it with types
    [K in keyof Paths]: Path<Paths[K]['_params'] & Params, Paths[K]['_useParams'] & UseParams, InjectParamsIntoPath<Paths[K]['_params'] & Params, Paths[K]['_useParams'] & UseParams, Paths[K]['_routes']>>;
};
/**
 * @important This config is not used in children paths
 */
type PathConfig = {
    /**
     * Turns the path into a hash path
     */
    hash?: boolean;
    /**
     * Add's "/modal" to the being of the path and turns the path into a hash path
     * @example /#/modal
     */
    hashModal?: boolean;
    /**
     * Add's "/modal" to the being of the path
     */
    isModal?: boolean;
};
export declare class Path<Params extends Record<string, any>, UseParams extends Record<string, any>, Routes extends Record<string, Path<any, any, any>>> {
    protected _params: Params;
    protected _useParams: UseParams;
    protected _routes: Routes;
    protected config: PathConfig;
    protected paths: Array<ParamPath<keyof Params, Params[keyof Params]> | string>;
    private _includeCurrentURL?;
    constructor(config?: PathConfig);
    protected clone<Params extends Record<string, any> = Record<string, any>, UseParams extends Record<string, any> = Record<string, any>, Routes extends Record<string, Path<any, any, any>> = Record<string, Path<any, any, any>>>(): Path<Params, UseParams, Routes>;
    /**
     * Makes method `get` to return the current path as hash.
     * @param includeCurrentURL {boolean}
     */
    includeCurrentURL(includeCurrentURL?: boolean): Path<Params, UseParams, Routes>;
    /**
     * Add's new value to the path. (Add's the value into the path in the calling other).
     * @param path {string} - new path part
     */
    addPath(path?: string): Path<Params, UseParams, Routes>;
    /**
     * Add's param to the path. (Add's the param into the path in the calling other).
     * @param value {string} - param name
     */
    param<K extends string = string, ParamsValue extends Params[K] | string | undefined = string>(value: K): Path<CleanObjects<Params, {
        [key in K]: ParamsValue;
    }>, CleanObjects<UseParams, {
        [key in K]: ParamsValue;
    }>, InjectParamsIntoPath<CleanObjects<Params, {
        [key in K]: ParamsValue;
    }>, CleanObjects<UseParams, {
        [key in K]: ParamsValue;
    }>, Routes>>;
    /**
     * Add's param to the path. (Add's the param into the path in the calling other).
     * @param value {string} - param name
     * @param config {ParamsConfigOptional<ParamsValue>} - param configuration.
     */
    param<K extends string = string, ParamsValue extends Params[K] | string | undefined = string, UseParamsValue = ParamsValue>(value: K, config: ParamsConfigOptional<UseParamsValue, ParamsValue>): Path<CleanObjects<Params, {
        [key in K]?: ParamsValue;
    }>, CleanObjects<UseParams, {
        [key in K]?: UseParamsValue;
    }>, InjectParamsIntoPath<CleanObjects<Params, {
        [key in K]?: ParamsValue;
    }>, CleanObjects<UseParams, {
        [key in K]?: UseParamsValue;
    }>, Routes>>;
    /**
     * Add's param to the path. (Add's the param into the path in the calling other).
     * @param value {string} - param name
     * @param config {ParamsConfig<ParamsValue>} - param configuration.
     */
    param<K extends string = string, ParamsValue extends Params[K] | string | undefined = string, UseParamsValue = ParamsValue>(value: K, config: ParamsConfig<UseParamsValue, ParamsValue>): Path<CleanObjects<Params, {
        [key in K]: ParamsValue;
    }>, CleanObjects<UseParams, {
        [key in K]: UseParamsValue;
    }>, InjectParamsIntoPath<CleanObjects<Params, {
        [key in K]: ParamsValue;
    }>, CleanObjects<UseParams, {
        [key in K]: UseParamsValue;
    }>, Routes>>;
    /**
     * Add's param to the path. (Add's the param into the path in the calling other).
     * @param value {ParamPath} - Param
     */
    param<K extends string = string, ParamsValue extends Params[K] | string | undefined = string, UseParamsValue = ParamsValue, IsOptional = false>(value: ParamPath<K, ParamsValue, UseParamsValue, IsOptional>): Path<CleanObjects<Params, (IsOptional extends false ? {
        [key in K]?: ParamsValue;
    } : {
        [key in K]: ParamsValue;
    })>, CleanObjects<UseParams, (IsOptional extends false ? {
        [key in K]?: UseParamsValue;
    } : {
        [key in K]: UseParamsValue;
    })>, InjectParamsIntoPath<CleanObjects<Params, (IsOptional extends false ? {
        [key in K]?: ParamsValue;
    } : {
        [key in K]: ParamsValue;
    })>, CleanObjects<UseParams, (IsOptional extends false ? {
        [key in K]?: UseParamsValue;
    } : {
        [key in K]: UseParamsValue;
    })>, Routes>>;
    /**
     * Children path's of current path.
     *
     * @param routes {Record<string, Path<any, any>>} - object containing the current path children path's
     */
    routes<S extends Record<string, Path<any, any, any>>>(routes: S): Path<Params, UseParams, S>;
    protected getBasePath(basePath?: string): string;
    protected createPath(basePath?: string, transforms?: Array<(params: StringifyObjectParams<Exclude<Params, undefined>>) => void>, beforePaths?: Array<(params: Exclude<Params, undefined>) => void>): PathType<Routes, Params, UseParams>;
}
/**
 * Creates a new path
 * @param path {string} - path base/start
 */
export declare const path: <Params extends Record<string, any>, UseParams extends Record<string, any>, Paths extends Record<string, Path<Params, UseParams, any>> = Record<string, Path<Params, UseParams, any>>>(path?: string, config?: PathConfig) => Path<Params, UseParams, Paths>;

type PathStructures = Record<string, Path<any, any, any>>;
type SetupPathsResult<R extends PathStructures> = {
	// @ts-expect-error Want to protect value, but also access it with types
    [K in keyof R]: PathType<R[K]['_routes'], R[K]['_params'], R[K]['_useParams']>;
};
/**
 * Creates the path's structure.
 * @param paths {R} - object with path's structure.
 */
export declare const SetupPaths: <R extends PathStructures>(paths: R) => SetupPathsResult<R>;
