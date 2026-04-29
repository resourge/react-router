/* eslint-disable @typescript-eslint/no-empty-object-type */
import { type ParamsConfig } from '../setupPaths/Param';

type CreateObject<
	I extends string,
	V,
	IsOptionalValue extends boolean | undefined
> = IsOptionalValue extends true ? { [Key in I]?: V } : { [Key in I]: V };

type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

type KeyWithValueObjectWithAllOption<T> = {
	[P in keyof T]-?: IsAllOptional<T[P]> extends true ? P : never
}[keyof T];

type NotKeyWithValueObjectWithAllOption<T> = {
	[P in keyof T]-?: IsAllOptional<T[P]> extends true ? never : P
}[keyof T];

type NotNullableKeys<T> = {
	[P in keyof T]-?: IsOptional<T[P]> extends true ? never : P
}[keyof T]; 

type NullableKeys<T> = {
	[P in keyof T]-?: IsOptional<T[P]> extends true ? P : never
}[keyof T];

type OptionalPropertyNames<T> =
	{ [K in keyof T]-?: ({} extends { [P in K]: T[K] } ? K : never) }[keyof T];

type SpreadProperties<L, R, K extends keyof L & keyof R> =
	{ [P in K]: Exclude<R[P], undefined> | L[P] };

type SpreadTwo<L, R> = Id<
	& Pick<L, Exclude<keyof L, keyof R>>
	& Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>>
	& Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>>
	& SpreadProperties<L, R, keyof L & OptionalPropertyNames<R>>
>;

export type _OptionalKeys<O> = {
	[K in keyof O]-?: {} extends Pick<O, K>
		? K
		: never
}[keyof O];

export type GetValueFromBeforePath<Config extends ParamsConfig = ParamsConfig> = Config['onGet'] extends undefined 
	? any 
	: Parameters<Config['onGet'] extends (...args: any[]) => any ? Config['onGet'] : (value: any) => any>[0];

export type GetValueFromTransform<Config extends ParamsConfig = ParamsConfig> = Config['onUseParams'] extends undefined 
	? string 
	: ReturnType<Config['onUseParams'] extends (...args: any[]) => any ? Config['onUseParams'] : (value: any) => string>;

export type IsAllOptional<
	T
> = keyof T extends keyof { [K in OptionalKeys<T>]: T[K] } ? true : false;

export type IsOptional<T> = undefined extends T ? true : false;

export type MakeObjectOptional<T> = {
	[K in KeyWithValueObjectWithAllOption<T>]?: T[K] extends object 
		? MakeObjectOptional<T[K]>
		: T[K]
} & {
	[K in NotKeyWithValueObjectWithAllOption<T>]-?: T[K] extends object 
		? MakeObjectOptional<T[K]>
		: T[K]
};

export type MakeUndefinedOptional<T> = {
	[K in NotNullableKeys<T>]: T[K] extends object ? MakeUndefinedOptional<T[K]> : T[K]
} & {
	[K in NullableKeys<T>]?: T[K] extends object ? MakeUndefinedOptional<T[K]> : T[K]
};

export type MergeObj<
	T extends Record<string, any>, 
	U extends Record<string, any>> = string extends keyof T
	? U
	: (
		string extends keyof U
			? T
			: U
	) & T;

export type MergeParamsAndCreate<
	Params extends Record<string, any>, 
	Key extends string, 
	IsOptionalValue extends boolean | undefined,
	V
> = string extends keyof Params
	? CreateObject<Key, V, IsOptionalValue>
	: Spread<Params, CreateObject<Key, V, IsOptionalValue>>;

export type OptionalKeys<O> =
	O extends unknown
		? _OptionalKeys<O>
		: never;

export type PickValue<T extends Record<string, any>, K extends string> = T[K];

export type Spread<L, R = any> = SpreadTwo<L, R>;
