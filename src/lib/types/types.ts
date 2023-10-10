import { type ParamsConfig } from '../setupPaths/Param'

export type _OptionalKeys<O extends object> = {
	// eslint-disable-next-line @typescript-eslint/ban-types
	[K in keyof O]-?: {} extends Pick<O, K>
		? K
		: never
}[keyof O]

export type OptionalKeys<O extends object> =
	O extends unknown
		? _OptionalKeys<O>
		: never

export type IsAllOptional<
	T extends Record<string, any>
> = keyof T extends keyof { [K in OptionalKeys<T>]: T[K] } ? true : false

type CreateObject<
	I extends string,
	V,
	IsOptional extends boolean | undefined
> = IsOptional extends true ? { [Key in I]?: V } : { [Key in I]: V } 

export type GetValueFromBeforePath<Config extends ParamsConfig = ParamsConfig> = Config['beforePath'] extends undefined 
	? any 
	: Parameters<Config['beforePath'] extends (...args: any[]) => any ? Config['beforePath'] : (value: any) => any>[0]

export type GetValueFromTransform<Config extends ParamsConfig = ParamsConfig> = Config['transform'] extends undefined 
	? string 
	: ReturnType<Config['transform'] extends (...args: any[]) => any ? Config['transform'] : (value: any) => string>

type OptionalPropertyNames<T> =
  { [K in keyof T]-?: ({} extends { [P in K]: T[K] } ? K : never) }[keyof T];

type SpreadProperties<L, R, K extends keyof L & keyof R> =
  { [P in K]: L[P] | Exclude<R[P], undefined> };

type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

type SpreadTwo<L, R> = Id<
  & Pick<L, Exclude<keyof L, keyof R>>
  & Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>>
  & Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>>
  & SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>;

type Spread<L, R = any> = SpreadTwo<L, R>

export type MergeParamsAndCreate<
	Params extends Record<string, any>, 
	Key extends string, 
	IsOptional extends boolean | undefined,
	V
> = string extends keyof Params
	? CreateObject<Key, V, IsOptional>
	: Spread<Params, CreateObject<Key, V, IsOptional>>

export type MergeObj<
	T extends Record<string, any>, 
	U extends Record<string, any>, 
> = string extends keyof T
	? U
	: T & (
		string extends keyof U
			? T
			: U
	)
