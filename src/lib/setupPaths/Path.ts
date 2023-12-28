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
		// @ts-expect-error Want to protect value, but also access it with types
		ResolveSlash<[IsHashPath<Routes[K]['_key']> extends true ? '' : BaseKey, Routes[K]['_key']]>,
		// @ts-expect-error Want to protect value, but also access it with types
		IsHashPath<Routes[K]['_key']> extends true 
			// @ts-expect-error Want to protect value, but also access it with types
			? Routes[K]['_params'] 
			// @ts-expect-error Want to protect value, but also access it with types
			: MergeObj<Params, Routes[K]['_params']>,
		// @ts-expect-error Want to protect value, but also access it with types
		IsHashPath<Routes[K]['_key']> extends true 
			// @ts-expect-error Want to protect value, but also access it with types
			? Routes[K]['_paramsResult'] 
			// @ts-expect-error Want to protect value, but also access it with types
			: MergeObj<ParamsResult, Routes[K]['_paramsResult']>,
		// @ts-expect-error Want to protect value, but also access it with types
		Routes[K]['_searchParams'],
		// @ts-expect-error Want to protect value, but also access it with types
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
			// @ts-expect-error Want to protect value, but also access it with types
			Routes[K]['_routes'],
			// @ts-expect-error Want to protect value, but also access it with types
			IsHashPath<Routes[K]['_key']> extends true 
				// @ts-expect-error Want to protect value, but also access it with types
				? Routes[K]['_params'] 
				// @ts-expect-error Want to protect value, but also access it with types
				: MergeObj<Params, Routes[K]['_params']>,
			// @ts-expect-error Want to protect value, but also access it with types
			IsHashPath<Routes[K]['_key']> extends true 
				// @ts-expect-error Want to protect value, but also access it with types
				? Routes[K]['_paramsResult'] 
				// @ts-expect-error Want to protect value, but also access it with types
				: MergeObj<ParamsResult, Routes[K]['_paramsResult']>
		>,
		// @ts-expect-error Want to protect value, but also access it with types
		Routes[K]['_key'],
		// @ts-expect-error Want to protect value, but also access it with types
		Routes[K]['_params'],
		// @ts-expect-error Want to protect value, but also access it with types
		Routes[K]['_paramsResult'],
		// @ts-expect-error Want to protect value, but also access it with types
		Routes[K]['_searchParams']
	>
}

export type PathType<
	Key extends string,
	Params extends Record<string, any>,
	ParamsResult extends Record<string, any>,
	SearchParams extends Record<string, any> | undefined,
	Routes extends Record<string, Path<any, string>>,
	All = IfIncludesParam<Key>
> = {
	/**
	 * Generated string from chain functions. Includes path with `params`.
	 */
	path: Key
} 
& InjectParamsIntoPathType<Key, Routes, Params, ParamsResult>
& (
	SearchParams extends undefined
		? (
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
				}
		)
		: {
			/**
			 * Method to obtain the true path.
			 * Calling it with `params` will replace the params with the params value on the path.
			 */
			get: <SP extends NonNullable<SearchParams>>(params: Params & { searchParams: SP }) => `${Key}?${ObjectToSearchParams<SP>}`
			/**
			 * Hook that returns the current search params
			 */
			useSearchParams: () => SearchParams
		}
) & (
	All extends true
		? {
			/**
			 * Hook to receive the params related to the route.
			 * Here all the transform method will transform the params to the desired params. 
			 */
			useParams: () => ParamsResult
		} : { }
)

export type AnyPath = PathType<
	any,
	any,
	any,
	any,
	any
> | PathType<
	any,
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

type Primitive = 'any'
| 'string'
| 'number'
| 'boolean';

export class Path<
	Routes extends Record<string, Path<any, string>>, 
	Key extends string,
	Params extends Record<string, any> = Record<string, any>,
	ParamsResult extends Record<string, any> = Record<string, any>,
	SearchParams extends Record<string, any> | undefined = undefined
> {
	protected _routes!: Routes;
	protected _key!: Key;
	protected _params!: Params;
	protected _paramsResult!: ParamsResult;
	protected _searchParams!: SearchParams;

	protected config: PathConfig = {};
	protected paths: Array<ParamPath<string> | string> = [];
	protected searchParams = new Map<string, { type?: Primitive } | undefined>();
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
		const _this = new Path<Routes, Key, Params, ParamsResult, SearchParams>();

		_this.paths = [...this.paths] as unknown as Array<ParamPath<string> | string>;
		_this._routes = {
			...this._routes
		} as unknown as Routes;
		_this._includeCurrentURL = this._includeCurrentURL;
		_this.config = this.config;
		_this.searchParams = this.searchParams;

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

	public searchParam<
		K extends string = string
	>(
		key: K,
		config?: {
			type?: Primitive
		}
	): Path<
		Routes,
		Key,
		Params,
		ParamsResult,
		MergeParamsAndCreate<SearchParams, K, false, any>
	> {
		const _this = this.clone();
		_this.searchParams.set(key, config);

		return _this as any;
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
		MergeParamsAndCreate<ParamsResult, K, false, string>,
		SearchParams
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
		MergeParamsAndCreate<ParamsResult, K, Config['optional'], GetValueFromTransform<Config>>,
		SearchParams
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
		MergeParamsAndCreate<ParamsResult, K, Config['optional'], GetValueFromTransform<Config>>,
		SearchParams
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
		MergeParamsAndCreate<ParamsResult, K, Config['optional'], GetValueFromTransform<Config>>,
		SearchParams
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
		ParamsResult,
		SearchParams
	> {
		const _this = this.clone() as unknown as Path<S, Key, Params, ParamsResult, SearchParams>;

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
							Object.keys(value._routes)
							&& checkFitInAllRoute(value._routes)
						)
					));
				}
				invariant(
					checkFitInAllRoute(routes),
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
			get(this: { path: string }, params: Params) {
				let _params: NonNullable<Params> = (
					params ? {
						...params 
					} : {}
				) as NonNullable<Params>;
				let searchParamString = '';

				if ( _params.searchParams ) {
					const { searchParams, ...rest } = _params;

					_params = rest as Params;

					searchParamString = parseParams(searchParams);
				}

				_beforePaths.forEach((beforePaths) => {
					beforePaths(_params);
				});

				let newPath = generatePath(
					this.path, 
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

				return `${newPath}${searchParamString}`;
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
	ParamsResult extends Record<string, any> = Record<string, any>,
	SearchParams extends Record<string, any> | undefined = undefined
>(): Path<Routes, '', Params, ParamsResult, SearchParams> 
export function path <
	Routes extends Record<string, Path<any, string>> = Record<string, Path<any, string>>,
	Params extends Record<string, any> = Record<string, any>,
	ParamsResult extends Record<string, any> = Record<string, any>,
	Key extends string = string,
	SearchParams extends Record<string, any> | undefined = undefined
>(path: Key): Path<Routes, Key, Params, ParamsResult, SearchParams> 
export function path <
	Routes extends Record<string, Path<any, string>> = Record<string, Path<any, string>>,
	Params extends Record<string, any> = Record<string, any>,
	ParamsResult extends Record<string, any> = Record<string, any>,
	Key extends string = string,
	SearchParams extends Record<string, any> | undefined = undefined
>(path: Key, config: PathConfig & {
	hash: true
}): Path<Routes, ResolveSlash<['#', Key]>, Params, ParamsResult, SearchParams> 
export function path <
	Routes extends Record<string, Path<any, string>> = Record<string, Path<any, string>>,
	Params extends Record<string, any> = Record<string, any>,
	ParamsResult extends Record<string, any> = Record<string, any>,
	Key extends string = string,
	SearchParams extends Record<string, any> | undefined = undefined
>(path: Key, config: PathConfig): Path<Routes, Key, Params, ParamsResult, SearchParams> 
export function path <
	Routes extends Record<string, Path<any, string>> = Record<string, Path<any, string>>,
	Params extends Record<string, any> = Record<string, any>,
	ParamsResult extends Record<string, any> = Record<string, any>,
	Key extends string = string,
	SearchParams extends Record<string, any> | undefined = undefined
>(path?: Key, config?: PathConfig): Path<Routes, Key, Params, ParamsResult, SearchParams> {
	return new Path(path, config);
}
