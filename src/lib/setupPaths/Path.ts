/* eslint-disable @typescript-eslint/prefer-reduce-type-parameter */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/ban-types */
import { useParams } from '../hooks/useParams';
import { type AsConst } from '../types/AsConst';
import { type Replace, type ResolveSlash } from '../types/StringTypes';
import { type StringifyObjectParams } from '../types/StringifyObjectParams';
import { type CleanObjects, type IsAllOptional } from '../types/types';
import { generatePath } from '../utils/generatePath';

import {
	Param,
	ParamPath,
	type ParamsConfig,
	type ParamsConfigOptional
} from './Param'

export function createPathWithCurrentLocationHasHash(path: string) {
	const newPath = new URL(path, window.location.origin)

	const windowURL = new URL(window.location as any);
	newPath.hash = window.location.pathname && window.location.pathname !== '/' ? windowURL.href.replace(windowURL.origin, '') : ''

	return newPath.href;
}

type UnionToIntersection<U> = (U extends never ? never : (arg: U) => never) extends (arg: infer I) => void
	? I
	: never;

type UnionToTuple<T, A extends any[] = []> = UnionToIntersection<T extends never ? never : (t: T) => T> extends (_: never) => infer W
	? UnionToTuple<Exclude<T, W>, [...A, W]>
	: A;

type Entries<T> = UnionToTuple<{
	[K in keyof T]: [K, T[K]]
}[keyof T]>

type ReplaceStringWithObjEntries<S extends string, ObjEntries> = ObjEntries extends [infer E, ...infer R] 
	? E extends [infer Key, infer Value]
		? string extends Value 
			? ReplaceStringWithObjEntries<S, R>
			: Replace<
				ReplaceStringWithObjEntries<S, R>, 
				ParamString<Key extends string 
					? Key 
					: ''
				>, 
				Value extends string 
					? Value 
					: ''
			> 
		: ReplaceStringWithObjEntries<S, R>
	: S

type ReplaceStringWithParams<S extends string, Params> = Params extends Record<string, any> 
	? ReplaceStringWithObjEntries<S, Entries<Params>>
	: S;

type ParamString<T extends string> = `:${T}`;

export type PathType<
	Key extends string,
	Routes extends Record<string, Path<any, any, any, boolean, string>>, 
	Params extends Record<string, any> | undefined = undefined, 
	UseParams extends Record<string, any> | undefined = undefined
> = {
	/**
	 * Method to obtain the true path.
	 * Calling it with `params` will replace the params with the params value on the path.
	 */
	get: Params extends undefined 
		? (() => string)
		: IsAllOptional<Params> extends true 
			? (
				(<P extends Params>(params?: AsConst<P>) => ReplaceStringWithParams<Key, P>)
			) : <P extends Params>(params: AsConst<P>) => ReplaceStringWithParams<Key, P>
	/**
	 * Generated string from chain functions. Includes path with `params`.
	 */
	path: Key
} & InjectParamsIntoPathType<Key, Routes, Params, UseParams> & (
	IsAllOptional<UseParams> extends false ? {
		/**
		 * Hook to receive the params related to the route.
		 * Here all the transform method will transform the params to the desired params. 
		 */
		useParams: () => UseParams
	} : (
		undefined extends UseParams ? {} : {
		/**
		 * Hook to receive the params related to the route.
		 * Here all the transform method will transform the params to the desired params. 
		 */
			useParams: () => UseParams
		}
	)
)

export type InjectParamsIntoPathType<
	BaseKey extends string,
	Paths extends Record<string, Path<any, any, any, boolean, string>>, 
	Params extends Record<string, any> | undefined = undefined, 
	UseParams extends Record<string, any> | undefined = undefined
> = {
	[K in keyof Paths]: PathType<
		// @ts-expect-error Want to protect value, but also access it with types
		ResolveSlash<[Paths[K]['_isHash'] extends true ? '' : BaseKey, Paths[K]['_key']]>,
		// @ts-expect-error Want to protect value, but also access it with types
		Paths[K]['_routes'], 
		// @ts-expect-error Want to protect value, but also access it with types
		Paths[K]['_params'] & (Paths[K]['_isHash'] extends true ? {} : Params),
		// @ts-expect-error Want to protect value, but also access it with types
		Paths[K]['_useParams'] & (Paths[K]['_isHash'] extends true ? {} : UseParams)
	>
}

export type InjectParamsIntoPath<
	Params extends Record<string, any>, 
	UseParams extends Record<string, any>, 
	Paths extends Record<string, Path<any, any, any, boolean, string>>
> = string extends keyof Params ? Paths : {
	[K in keyof Paths]: Path<
		// @ts-expect-error Want to protect value, but also access it with types
		Paths[K]['_params'] & (Paths[K]['_isHash'] extends true ? {} : Params), 
		// @ts-expect-error Want to protect value, but also access it with types
		Paths[K]['_useParams'] & (Paths[K]['_isHash'] extends true ? {} : UseParams), 
		InjectParamsIntoPath<
			// @ts-expect-error Want to protect value, but also access it with types
			Paths[K]['_params'] & (Paths[K]['_isHash'] extends true ? {} : Params), 
			// @ts-expect-error Want to protect value, but also access it with types
			Paths[K]['_useParams'] & (Paths[K]['_isHash'] extends true ? {} : UseParams), 
			// @ts-expect-error Want to protect value, but also access it with types
			Paths[K]['_routes']
		>,
		// @ts-expect-error Want to protect value, but also access it with types
		Paths[K]['_isHash'],
		// @ts-expect-error Want to protect value, but also access it with types
		Paths[K]['_key']
	>
}

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
	Params extends Record<string, any>, 
	UseParams extends Record<string, any>, 
	Routes extends Record<string, Path<any, any, any, boolean, string>>, 
	IsHash extends boolean,
	Key extends string
> {
	protected _params!: Params;
	protected _useParams!: UseParams;
	protected _routes!: Routes;
	protected _isHash!: IsHash;
	protected _key!: Key;

	protected config: PathConfig = {}
	protected paths: Array<ParamPath<keyof Params, Params[keyof Params]> | string> = [];
	private _includeCurrentURL?: boolean;

	constructor(config?: PathConfig) {
		this.config = config ?? {};
	}

	protected clone<
		Params extends Record<string, any> = Record<string, any>, 
		UseParams extends Record<string, any> = Record<string, any>, 
		Routes extends Record<string, Path<any, any, any, boolean, string>> = Record<string, Path<any, any, any, boolean, string>>
	>() { 
		const _this = new Path<Params, UseParams, Routes, IsHash, Key>();

		_this.paths = [...this.paths] as unknown as Array<ParamPath<Params[keyof Params]> | string>;
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
		const _this = this.clone<Params, UseParams, Routes>();
		_this._includeCurrentURL = includeCurrentURL;
		return _this;
	}

	/**
	 * Add's new value to the path. (Add's the value into the path in the calling other).
	 * @param path {string} - new path part
	 */
	public addPath(path?: string) {
		const _this = this.clone<Params, UseParams, Routes>();
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
		K extends string = string, 
		ParamsValue extends Params[K] | string | undefined = string
	>(
		value: K
	): Path<
		CleanObjects<Params, { [key in K]: ParamsValue }>, 
		CleanObjects<UseParams, { [key in K]: ParamsValue }>, 
		InjectParamsIntoPath<
			CleanObjects<Params, { [key in K]: ParamsValue }>, 
			CleanObjects<UseParams, { [key in K]: ParamsValue }>, 
			Routes
		>,
		IsHash,
		ResolveSlash<[Key, ParamString<K>]>
	>
	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 * @param config {ParamsConfigOptional<ParamsValue>} - param configuration.
	 */
	public param<
		K extends string = string, 
		ParamsValue extends Params[K] | string | undefined = string,
		UseParamsValue = ParamsValue
	>(
		value: K, 
		config: ParamsConfigOptional<UseParamsValue extends ParamsValue ? ParamsValue : UseParamsValue, ParamsValue> 
	): Path<
		CleanObjects<Params, { [key in K]?: ParamsValue }>, 
		CleanObjects<UseParams, { [key in K]?: UseParamsValue }>, 
		InjectParamsIntoPath<
			CleanObjects<Params, { [key in K]?: ParamsValue }>, 
			CleanObjects<UseParams, { [key in K]?: UseParamsValue }>, 
			Routes
		>,
		IsHash,
		ResolveSlash<[Key, ParamString<K>]>
	>;
	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 * @param config {ParamsConfig<ParamsValue>} - param configuration.
	 */
	public param<
		K extends string = string,
		ParamsValue extends Params[K] | string | undefined = string,
		UseParamsValue = ParamsValue
	>(
		value: K, 
		config: ParamsConfig<UseParamsValue extends ParamsValue ? ParamsValue : UseParamsValue, ParamsValue> 
	): Path<
		CleanObjects<Params, { [key in K]: ParamsValue }>, 
		CleanObjects<UseParams, { [key in K]: UseParamsValue }>, 
		InjectParamsIntoPath<
			CleanObjects<Params, { [key in K]: ParamsValue }>, 
			CleanObjects<UseParams, { [key in K]: UseParamsValue }>, 
			Routes
		>,
		IsHash,
		ResolveSlash<[Key, ParamString<K>]>
	>;
	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {ParamPath} - Param
	 */
	public param<
		K extends string = string,
		ParamsValue extends Params[K] | string | undefined = string,
		UseParamsValue = ParamsValue,
		IsOptional = false
	>(
		value: ParamPath<K, ParamsValue, UseParamsValue, IsOptional>
	): Path<
		CleanObjects<Params, (IsOptional extends false ? { [key in K]?: ParamsValue } : { [key in K]: ParamsValue })>, 
		CleanObjects<UseParams, (IsOptional extends false ? { [key in K]?: UseParamsValue } : { [key in K]: UseParamsValue })>, 
		InjectParamsIntoPath<
			CleanObjects<Params, (IsOptional extends false ? { [key in K]?: ParamsValue } : { [key in K]: ParamsValue })>, 
			CleanObjects<UseParams, (IsOptional extends false ? { [key in K]?: UseParamsValue } : { [key in K]: UseParamsValue })>, 
			Routes
		>,
		IsHash,
		ResolveSlash<[Key, ParamString<K>]>
	>;

	/**
	 * Add's param to the path. (Add's the param into the path in the calling other).
	 * @param value {string} - param name
	 * @param config {ParamsConfig<ParamsValue>} - param configuration.
	 */
	public param<
		K extends string = string,
		ParamsValue extends Params[K] | string | undefined = string,
		UseParamsValue = ParamsValue
	>(
		value: K | ParamPath<K, ParamsValue>, 
		config?: ParamsConfig<UseParamsValue extends ParamsValue ? ParamsValue : UseParamsValue, ParamsValue> 
	): Path<
		CleanObjects<Params, { [key in K]: ParamsValue }>, 
		CleanObjects<UseParams, { [key in K]: UseParamsValue }>, 
		InjectParamsIntoPath<
			CleanObjects<Params, { [key in K]: ParamsValue }>, 
			CleanObjects<UseParams, { [key in K]: UseParamsValue }>, 
			Routes
		>,
		IsHash,
		ResolveSlash<[Key, ParamString<K>]>
	> {
		const _this = this.clone<(string extends keyof Params ? {} : Params) & { [key in K]: ParamsValue }, Routes>();

		if ( value instanceof ParamPath ) {
			_this.paths.push(
				value as any
			);
			return _this as any;
		}

		_this.paths.push(
			Param<K, UseParamsValue, any>(
				value,
				config as any
			) as any
		);

		return _this as any;
	}

	/**
	 * Children path's of current path.
	 * 
	 * @param routes {Record<string, Path<any, any, any>>} - object containing the current path children path's
	 */
	public routes<S extends Record<string, Path<any, any, any, boolean, string>>>(
		routes: S
	): Path<Params, UseParams, S, IsHash, Key> {
		const _this = this.clone<Params, UseParams, S>();

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

	protected getBasePath(basePath: string = '') {
		return this.config.hash ? '#' : basePath;
	}

	protected createPath(
		basePath?: string, 
		transforms?: Array<(params: StringifyObjectParams<Exclude<Params, undefined>>) => void>, 
		beforePaths?: Array<(params: Exclude<Params, undefined>) => void>
	): PathType<Key, Routes, Params, UseParams> {
		// Groups new transformations with transformations from parents
		const _transforms: Array<(params: StringifyObjectParams<Exclude<Params, undefined>>) => void> = transforms ? [...transforms] : [];
		// Groups new transformations with transformations from parents
		const _beforePaths: Array<(params: Exclude<Params, undefined>) => void> = beforePaths ? [...beforePaths] : [];

		// Creates path for current route
		let path = `${this.getBasePath(basePath)}${this.paths
		.map((path) => {
			if ( typeof path === 'string' ) {
				return path;
			}
			if ( path.config?.transform ) {
				_transforms.push((params: StringifyObjectParams<Exclude<Params, undefined>>) => {
					(params as any)[path.key] = path.config!.transform!(params[path.key]);
				})
			}
			if ( path.config?.beforePath ) {
				_beforePaths.push((params: Exclude<Params, undefined>) => {
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

		return {
			path,
			get: (params: Params) => {
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

				if ( this._includeCurrentURL ) {
					newPath = createPathWithCurrentLocationHasHash(newPath);
				} 

				return newPath;
			},
			useParams: () => {
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
	Params extends Record<string, any>,
	UseParams extends Record<string, any>,
	Paths extends Record<string, Path<Params, UseParams, any, boolean, string>> = Record<string, Path<Params, UseParams, any, boolean, string>>
>(): Path<Params, UseParams, Paths, false, ''> 
export function path <
	Params extends Record<string, any>,
	UseParams extends Record<string, any>,
	Paths extends Record<string, Path<Params, UseParams, any, boolean, string>> = Record<string, Path<Params, UseParams, any, boolean, string>>,
	Key extends string = string
>(path: Key): Path<Params, UseParams, Paths, false, Key> 
export function path <
	Params extends Record<string, any>,
	UseParams extends Record<string, any>,
	Paths extends Record<string, Path<Params, UseParams, any, boolean, string>> = Record<string, Path<Params, UseParams, any, boolean, string>>,
	Key extends string = string
>(path: Key, config: PathConfig & {
	hash: true
}): Path<Params, UseParams, Paths, true, ResolveSlash<['#', Key]>> 
export function path <
	Params extends Record<string, any>,
	UseParams extends Record<string, any>,
	Paths extends Record<string, Path<Params, UseParams, any, boolean, string>> = Record<string, Path<Params, UseParams, any, boolean, string>>,
	Key extends string = string
>(path?: Key, config?: PathConfig): Path<Params, UseParams, Paths, boolean, Key> {
	return new Path(config).addPath(path) as Path<Params, UseParams, Paths, boolean, Key>;
}
