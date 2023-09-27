/* eslint-disable @typescript-eslint/prefer-reduce-type-parameter */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/ban-types */
import { parseParams } from '@resourge/react-search-params';

import { useParams } from '../hooks/useParams';
import { type AsConst } from '../types/AsConst';
import { type ObjectToSearchParams } from '../types/ConvertToStringTypes';
import { type Metadata } from '../types/Metadata';
import { type ParamString, type IsHashPath, type ResolveSlash } from '../types/StringTypes'
import { type StringifyObjectParams } from '../types/StringifyObjectParams';
import {
	type MergeParamsAndCreate,
	type IsAllOptional,
	type GetValueFromBeforePath,
	type GetValueFromTransform,
	type MergeObj
} from '../types/types'
import { generatePath } from '../utils/generatePath';

import { Param, ParamPath, type ParamsConfig } from './Param'

function createPathWithCurrentLocationHasHash(path: string) {
	const newPath = new URL(path, window.location.origin)

	const windowURL = new URL(window.location as any);
	newPath.hash = window.location.pathname && window.location.pathname !== '/' ? windowURL.href.replace(windowURL.origin, '') : ''

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
		Routes[K]['_paramsResult']
	>
}

export type PathType<
	Key extends string,
	Params extends Record<string, any>,
	ParamsResult extends Record<string, any>,
	Routes extends Record<string, Path<any, string>>,
	WithSearchParams extends boolean = true
> = {
	/**
	 * Method to obtain the true path.
	 * Calling it with `params` will replace the params with the params value on the path.
	 */
	get: string extends keyof Params
		? () => Key
		: IsAllOptional<Params> extends true 
			? (params?: Params) => Key
			: (params: Params) => Key
	/**
	 * Generated string from chain functions. Includes path with `params`.
	 */
	path: Key
} 
& (
	WithSearchParams extends false 
		? { } 
		: InjectParamsIntoPathType<Key, Routes, Params, ParamsResult>
) & (
	string extends keyof Params 
		? {} 
		: {
			/**
			 * Hook to receive the params related to the route.
			 * Here all the transform method will transform the params to the desired params. 
			 */
			useParams: () => ParamsResult
		}
) 
& (
	WithSearchParams extends true 
		? { 
			withSearchParams: <SP extends Record<string, any>>(searchParams: SP) => PathType<`${Key}?${ObjectToSearchParams<SP>}`, Params, ParamsResult, Routes, false> 
		} 
		: {}
)

export type AnyPath<Params extends Record<string, any>> = PathType<
	any,
	Params,
	Record<string, any>,
	Record<string, Path<any, string>>
>

/**
 * @important This config is not used in children paths
 */
type PathConfig = {
	/**
	 * Turns the path into a hash path
	 */
	hash?: boolean
}

export class Path<
	Routes extends Record<string, Path<any, string>>, 
	Key extends string,
	Params extends Record<string, any> = Record<string, any>,
	ParamsResult extends Record<string, any> = Record<string, any>
> {
	protected _routes!: Routes;
	protected _key!: Key;
	protected _params!: Params;
	protected _paramsResult!: ParamsResult;

	protected config: PathConfig = {}
	protected paths: Array<ParamPath<string> | string> = [];
	protected _metadata?: Metadata<string, string>;
	private _includeCurrentURL?: boolean;

	constructor(config?: PathConfig) {
		this.config = config ?? {};
	}

	protected clone() { 
		const _this = new Path<Routes, Key, Params, ParamsResult>();

		_this.paths = [...this.paths] as unknown as Array<ParamPath<string> | string>;
		_this._routes = {
			...this._routes
		} as unknown as Routes;
		_this._includeCurrentURL = this._includeCurrentURL;
		_this.config = this.config;
		_this._metadata = this._metadata;

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

		_this._routes = routes;

		return _this;
	}

	public metadata<Langs extends string, R extends string | Record<Langs, string>>(metadata: Metadata<Langs, R>) {
		const _this = this.clone() as unknown as Path<Routes, Key, Params, ParamsResult>;

		_this._metadata = metadata as Metadata<string, string>;

		return _this;
	}

	protected getBasePath(basePath: string = '') {
		return this.config.hash ? '#' : basePath;
	}

	protected createPath(
		basePath?: string, 
		transforms?: Array<(params: StringifyObjectParams<Record<string, any>>) => void>, 
		beforePaths?: Array<(params: Record<string, any>) => void>
	): any {
		// Groups new transformations with transformations from parents
		const _transforms: Array<(params: StringifyObjectParams<Record<string, any>>) => void> = transforms ? [...transforms] : [];
		// Groups new transformations with transformations from parents
		const _beforePaths: Array<(params: Record<string, any>) => void> = beforePaths ? [...beforePaths] : [];

		// Creates path for current route
		let path = `${this.getBasePath(basePath)}${this.paths
		.map((path) => {
			if ( typeof path === 'string' ) {
				return path;
			}
			if ( path.config?.transform ) {
				_transforms.push((params) => {
					(params as any)[path.key] = path.config!.transform!(params[path.key]);
				})
			}
			if ( path.config?.beforePath ) {
				_beforePaths.push((params) => {
					(params as any)[path.key] = path.config!.beforePath!(params[path.key]);
				})
			}
			return path.param;
		})
		.join('')}`

		path = path === '' ? '/' : path

		// Generates routes
		const paths = Object.entries(this._routes ?? {})
		.reduce((obj, [key, value]) => {
			obj[key] = value.createPath(path === '/' ? '' : path, _transforms, _beforePaths);
			return obj;
			// Too hard to put a working type that doesn't create a problem in return
		}, {} as any) 

		const _includeCurrentURL = this._includeCurrentURL

		return {
			path,
			_metadata: this._metadata,
			withSearchParams(sp: Record<string, any>) {
				return Object.assign({}, this, {
					searchParams: parseParams(sp) 
				})
			},
			get(this: { searchParams?: string }, params: Params) {
				const _params: Exclude<Params, undefined> = (params ? {
					...params 
				} : {}) as Exclude<Params, undefined>;

				_beforePaths.forEach((beforePaths) => {
					beforePaths(_params);
				})

				let newPath = generatePath(
					path, 
					_params
				)

				if ( _includeCurrentURL ) {
					newPath = createPathWithCurrentLocationHasHash(newPath);
				} 

				return `${newPath}${this.searchParams ?? ''}`;
			},
			useParams() {
				return useParams<StringifyObjectParams<Exclude<Params, undefined>>>((params) => {
					_transforms.forEach((transform) => {
						transform(params);
					})

					return params;
				})
			},
			...paths
		}
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
>(path?: Key, config?: PathConfig): Path<Routes, Key, Params, ParamsResult> {
	return new Path(config).addPath(path) as Path<Routes, Key, Params, ParamsResult>;
}
