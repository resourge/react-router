/* eslint-disable @typescript-eslint/prefer-reduce-type-parameter */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/ban-types */
import { parseParams } from '@resourge/react-search-params';
import invariant from 'tiny-invariant';

import { useParams } from '../hooks/useParams';
import { type AsConst } from '../types/AsConst';
import { type ObjectToSearchParams } from '../types/ConvertToStringTypes';
import {
	type ParamString,
	type IsHashPath,
	type ResolveSlash,
	type IfIncludesParam
} from '../types/StringTypes';
import { type StringifyObjectParams } from '../types/StringifyObjectParams';
import {
	type MergeParamsAndCreate,
	type IsAllOptional,
	type GetValueFromBeforePath,
	type GetValueFromTransform,
	type MergeObj
} from '../types/types';
import { FIT_IN_ALL_ROUTES, FIT_IN_ALL_ROUTES_REG } from '../utils/constants';
import { generatePath } from '../utils/generatePath';
import { resolveSlash } from '../utils/resolveLocation';

import { Param, ParamPath, type ParamsConfig } from './Param';

function createPathWithCurrentLocationHasHash(path: string) {
	const newPath = new URL(path, window.location.origin);

	const windowURL = new URL(window.location as any);
	newPath.hash = window.location.pathname && window.location.pathname !== '/' ? windowURL.href.replace(windowURL.origin, '') : '';

	return newPath.href;
}

export type InjectParamsIntoPathType<
	BaseKey extends string,
	Routes extends Record<string, Path<any, string>>,
	Params extends Record<string, any>,
	ParamsResult extends Record<string, any>,
> = {
	[K in keyof Routes]: PathType<
		ResolveSlash<[IsHashPath<Routes[K]['_key']> extends true ? '' : BaseKey, Routes[K]['_key']]>,
		IsHashPath<Routes[K]['_key']> extends true 
			? Routes[K]['_params'] 
			: MergeObj<Params, Routes[K]['_params']>,
		IsHashPath<Routes[K]['_key']> extends true 
			? Routes[K]['_paramsResult'] 
			: MergeObj<ParamsResult, Routes[K]['_paramsResult']>,
		Routes[K]['_routes']
	>
}

export type AddConfigParamsIntoRoutes<
	Routes extends Record<string, Path<any, string>>,
	Params extends Record<string, any>,
	ParamsResult extends Record<string, any>,
> = {
	[K in keyof Routes]: Path<
		AddConfigParamsIntoRoutes<
			Routes[K]['_routes'],
			IsHashPath<Routes[K]['_key']> extends true 
				? Routes[K]['_params'] 
				: MergeObj<Params, Routes[K]['_params']>,
			IsHashPath<Routes[K]['_key']> extends true 
				? Routes[K]['_paramsResult'] 
				: MergeObj<ParamsResult, Routes[K]['_paramsResult']>
		>,
		Routes[K]['_key'],
		Routes[K]['_params'],
		Routes[K]['_paramsResult']
	>
}

export type PathType<
	Key extends string,
	Params extends Record<string, any>,
	ParamsResult extends Record<string, any>,
	Routes extends Record<string, Path<any, string>>,
	All = IfIncludesParam<Key>
> = {
	/**
	 * Generated string from chain functions. Includes path with `params`.
	 */
	path: Key
	withSearchParams: <SP extends Record<string, any>>(searchParams: AsConst<SP>) => (
		All extends false
			? {
				/**
				 * Method to obtain the true path.
				 * Calling it with `params` will replace the params with the params value on the path.
				 */
				get: () => `${Key}?${ObjectToSearchParams<SP>}`
			} 
			: {
				/**
				 * Method to obtain the true path.
				 * Calling it with `params` will replace the params with the params value on the path.
				 */
				get: IsAllOptional<Params> extends true 
					? (params?: Params) => `${Key}?${ObjectToSearchParams<SP>}`
					: (params: Params) => `${Key}?${ObjectToSearchParams<SP>}`
			}
	)
} 
& InjectParamsIntoPathType<Key, Routes, Params, ParamsResult>
& (
	All extends false
		? {
			/**
			 * Method to obtain the true path.
			 * Calling it with `params` will replace the params with the params value on the path.
			 */
			get: () => Key
		} 
		: {
			/**
			 * Method to obtain the true path.
			 * Calling it with `params` will replace the params with the params value on the path.
			 */
			get: IsAllOptional<Params> extends true 
				? (params?: Params) => Key
				: (params: Params) => Key
			/**
			 * Hook to receive the params related to the route.
			 * Here all the transform method will transform the params to the desired params. 
			 */
			useParams: () => ParamsResult
		}
)

export type AnyPath = PathType<
	any,
	any,
	any,
	any
> | PathType<
	any,
	any,
	any,
	any,
	true
>

/**
 * @important This config is not used in children paths
 */
type PathConfig = {
	/**
	 * Makes so path works in all routes
	 */
	fitInAllRoutes?: boolean
	/**
	 * Turns path into a hash path
	 */
	hash?: boolean
}

export class Path<
	Routes extends Record<string, Path<any, string>>, 
	Key extends string,
	Params extends Record<string, any> = Record<string, any>,
	ParamsResult extends Record<string, any> = Record<string, any>
> {
	public _routes!: Routes;
	public _key!: Key;
	public _params!: Params;
	public _paramsResult!: ParamsResult;

	protected config: PathConfig = {};
	protected paths: Array<ParamPath<string> | string> = [];
	private _includeCurrentURL?: boolean;

	constructor(path?: string, config?: PathConfig) {
		this.config = config ?? {};

		let _path: string | undefined = path;
		if ( config?.fitInAllRoutes ) {
			_path = `${FIT_IN_ALL_ROUTES}${path ?? ''}`;
		}
		else if ( path ) {
			_path = `/${path}`;
		}

		if ( _path ) {
			this.paths.push(_path);
		}
	}

	protected clone() { 
		const _this = new Path<Routes, Key, Params, ParamsResult>();

		_this.paths = [...this.paths] as unknown as Array<ParamPath<string> | string>;
		_this._routes = {
			...this._routes
		} as unknown as Routes;
		_this._includeCurrentURL = this._includeCurrentURL;
		_this.config = this.config;

		return _this;
	}

	/**
	 * Makes method `get` to return the current path as hash.
	 * @param includeCurrentURL {boolean} @default true
	 */
	public includeCurrentURL(includeCurrentURL: boolean = true) {
		const _this = this.clone();
		_this._includeCurrentURL = includeCurrentURL;
		return _this;
	}

	/**
	 * Add's new value to the path. (Add's the value into the path in the calling other).
	 * @param path {string} - new path part
	 */
	public addPath(path?: string) {
		const _this = this.clone();
		if ( path ) {
			_this.paths.push(`/${path}`);
		}
		return _this;
	}

	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 */
	public param<
		K extends string = string
	>(
		value: K
	): Path<
		Routes,
		ResolveSlash<[Key, ParamString<K>]>, 
		MergeParamsAndCreate<Params, K, false, any>,
		MergeParamsAndCreate<ParamsResult, K, false, string>
	>
	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 */
	public param<
		K extends string = string,
		Config extends ParamsConfig = ParamsConfig
	>(
		value: ParamPath<K, Config>
	): Path<
		Routes,
		ResolveSlash<[Key, ParamString<K>]>, 
		MergeParamsAndCreate<Params, K, Config['optional'], GetValueFromBeforePath<Config>>,
		MergeParamsAndCreate<ParamsResult, K, Config['optional'], GetValueFromTransform<Config>>
	>
	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 * @param config {ParamsConfig<ParamsValue>} - param configuration.
	 */
	public param<
		K extends string = string,
		Config extends ParamsConfig = ParamsConfig
	>(
		value: K, 
		config: Config
	): Path<
		Routes,
		ResolveSlash<[Key, ParamString<Config['optional'] extends true ? `${K}?` : K>]>,
		MergeParamsAndCreate<Params, K, Config['optional'], GetValueFromBeforePath<Config>>,
		MergeParamsAndCreate<ParamsResult, K, Config['optional'], GetValueFromTransform<Config>>
	>;
	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 * @param config {ParamsConfig<ParamsValue>} - param configuration.
	 */
	public param<
		K extends string = string,
		Config extends ParamsConfig = ParamsConfig
	>(
		value: K | ParamPath<K, Config>, 
		config?: Config
	): Path<
		Routes,
		ResolveSlash<[Key, ParamString<K>]>,
		MergeParamsAndCreate<Params, K, Config['optional'], GetValueFromBeforePath<Config>>,
		MergeParamsAndCreate<ParamsResult, K, Config['optional'], GetValueFromTransform<Config>>
	> {
		const _this = this.clone();

		if ( value instanceof ParamPath ) {
			_this.paths.push(
				value as any
			);
			return _this as any;
		}

		_this.paths.push(
			Param<K, Config>(
				value,
				config as AsConst<Config>
			) as any
		);

		return _this as any;
	}

	/**
	 * Children path's of current path.
	 * 
	 * @param routes {Record<string, Path<any, any, any>>} - object containing the current path children path's
	 */
	public routes<
		S extends Record<string, Path<any, string>>
	>(
		routes: S
	): Path<
		S, 
		Key, 
		Params,
		ParamsResult
	> {
		const _this = this.clone() as unknown as Path<S, Key, Params, ParamsResult>;

		/* if ( __DEV__ ) {
			invariant(
				Object.entries(routes).find(([key, value]) => {
					return !(value.config.hash || value.config.hashModal)
				}),
				'Path\'s inside \'.routes({ ... })\' cannot be hash path\'s'
			);
		} */

		if ( __DEV__ ) {
			if ( this.config?.fitInAllRoutes) {
				function checkFitInAllRoute(routes: Record<string, Path<any, string>>): boolean {
					return Object.values(routes)
					.some((value) => (
						value.config.fitInAllRoutes
						|| (
							value._routes
							&& Object.keys(value._routes)
							&& checkFitInAllRoute(value._routes)
						)
					));
				}
				invariant(
					!checkFitInAllRoute(routes),
					'Path\'s inside a fitInAllRoutes Path cannot have another fitInAllRoutes\'s'
				);
			}
		}

		_this._routes = routes;

		return _this;
	}

	protected getBasePath(basePath: string = '') {
		return this.config.hash ? '#' : basePath;
	}

	protected createPath(
		previousPaths: Array<string | ParamPath<string, ParamsConfig>> = [],
		transforms?: Array<(params: StringifyObjectParams<Record<string, any>>) => void>, 
		beforePaths?: Array<(params: Record<string, any>) => void>
	): any {
		// Groups new transformations with transformations from parents
		const _transforms: Array<(params: StringifyObjectParams<Record<string, any>>) => void> = transforms ? [...transforms] : [];
		// Groups new transformations with transformations from parents
		const _beforePaths: Array<(params: Record<string, any>) => void> = beforePaths ? [...beforePaths] : [];

		const newPaths = [
			...(this.config.hash ? ['#'] : previousPaths), 
			...this.paths
		];

		// Creates path for current route
		const path = (
			newPaths
			.map((path, index, arr) => {
				if ( typeof path === 'string' ) {
					return path;
				}
				if ( path.config?.transform ) {
					_transforms.push((params) => {
						(params as any)[path.key] = path.config!.transform!(params[path.key]);
					});
				}
				if ( path.config?.beforePath ) {
					_beforePaths.push((params) => {
						(params as any)[path.key] = path.config!.beforePath!(params[path.key]);
					});
				}
				return path.parseParam((arr.length - 1) !== index );
			})
			.join('')
		) || '/';

		// Generates routes
		const paths = Object.entries(this._routes ?? {})
		.reduce((obj, [key, value]) => {
			obj[key] = value.createPath(newPaths, _transforms, _beforePaths);
			return obj;
			// Too hard to put a working type that doesn't create a problem in return
		}, {} as any); 

		const _includeCurrentURL = this._includeCurrentURL;

		return {
			path,
			withSearchParams(sp: Record<string, any>) {
				return Object.assign({}, this, {
					searchParams: parseParams(sp) 
				});
			},
			get(this: { searchParams?: string }, params: Params) {
				const _params: Exclude<Params, undefined> = (params ? {
					...params 
				} : {}) as Exclude<Params, undefined>;

				_beforePaths.forEach((beforePaths) => {
					beforePaths(_params);
				});

				let newPath = generatePath(
					path, 
					_params
				);

				if ( newPath.includes(FIT_IN_ALL_ROUTES) ) {
					const url = new URL(window.location.href);

					url.pathname = resolveSlash(url.pathname, newPath.replace(FIT_IN_ALL_ROUTES_REG, ''));

					newPath = url.href.replace(url.origin, '');
				}

				if ( _includeCurrentURL ) {
					newPath = createPathWithCurrentLocationHasHash(newPath);
				} 

				return `${newPath}${this.searchParams ?? ''}`;
			},
			useParams() {
				return useParams<StringifyObjectParams<Exclude<Params, undefined>>>((params) => {
					_transforms.forEach((transform) => {
						transform(params);
					});

					return params;
				});
			},
			...paths
		};
	}
}

/**
 * Creates a new path
 * @param path {string} - path base/start
 */
export function path <
	Routes extends Record<string, Path<any, string>> = Record<string, Path<any, string>>,
	Params extends Record<string, any> = Record<string, any>,
	ParamsResult extends Record<string, any> = Record<string, any>
>(): Path<Routes, '', Params, ParamsResult> 
export function path <
	Routes extends Record<string, Path<any, string>> = Record<string, Path<any, string>>,
	Params extends Record<string, any> = Record<string, any>,
	ParamsResult extends Record<string, any> = Record<string, any>,
	Key extends string = string
>(path: Key): Path<Routes, Key, Params, ParamsResult> 
export function path <
	Routes extends Record<string, Path<any, string>> = Record<string, Path<any, string>>,
	Params extends Record<string, any> = Record<string, any>,
	ParamsResult extends Record<string, any> = Record<string, any>,
	Key extends string = string
>(path: Key, config: PathConfig & {
	hash: true
}): Path<Routes, ResolveSlash<['#', Key]>, Params, ParamsResult> 
export function path <
	Routes extends Record<string, Path<any, string>> = Record<string, Path<any, string>>,
	Params extends Record<string, any> = Record<string, any>,
	ParamsResult extends Record<string, any> = Record<string, any>,
	Key extends string = string
>(path: Key, config: PathConfig): Path<Routes, Key, Params, ParamsResult> 
export function path <
	Routes extends Record<string, Path<any, string>> = Record<string, Path<any, string>>,
	Params extends Record<string, any> = Record<string, any>,
	ParamsResult extends Record<string, any> = Record<string, any>,
	Key extends string = string
>(path?: Key, config?: PathConfig): Path<Routes, Key, Params, ParamsResult> {
	return new Path(path, config);
}
