import { type ParamsConfig } from '../setupPaths/Param';

export type IsOptional<T> = undefined extends T ? true : false;

export type _OptionalKeys<O> = {
	// eslint-disable-next-line @typescript-eslint/ban-types
	[K in keyof O]-?: {} extends Pick<O, K>
		? K
		: never
}[keyof O];

export type OptionalKeys<O> =
	O extends unknown
		? _OptionalKeys<O>
		: never;

export type IsAllOptional<
	T
> = keyof T extends keyof { [K in OptionalKeys<T>]: T[K] } ? true : false;

type CreateObject<
	I extends string,
	V,
	IsOptionalValue extends boolean | undefined
> = IsOptionalValue extends true ? { [Key in I]?: V } : { [Key in I]: V }; 

export type GetValueFromBeforePath<Config extends ParamsConfig = ParamsConfig> = Config['onGet'] extends undefined 
	? any 
	: Parameters<Config['onGet'] extends (...args: any[]) => any ? Config['onGet'] : (value: any) => any>[0];

export type GetValueFromTransform<Config extends ParamsConfig = ParamsConfig> = Config['onUseParams'] extends undefined 
	? string 
	: ReturnType<Config['onUseParams'] extends (...args: any[]) => any ? Config['onUseParams'] : (value: any) => string>;

type OptionalPropertyNames<T> =
  { [K in keyof T]-?: ({} extends { [P in K]: T[K] } ? K : never) }[keyof T];

type SpreadProperties<L, R, K extends keyof L & keyof R> =
  { [P in K]: L[P] | Exclude<R[P], undefined> };

type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

type SpreadTwo<L, R> = Id<
	& Pick<L, Exclude<keyof L, keyof R>>
	& Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>>
	& Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>>
	& SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>;

export type Spread<L, R = any> = SpreadTwo<L, R>;

export type MergeParamsAndCreate<
	Params extends Record<string, any>, 
	Key extends string, 
	IsOptionalValue extends boolean | undefined,
	V
> = string extends keyof Params
	? CreateObject<Key, V, IsOptionalValue>
	: Spread<Params, CreateObject<Key, V, IsOptionalValue>>;

export type MergeObj<
	T extends Record<string, any>, 
	U extends Record<string, any> 
> = string extends keyof T
	? U
	: T & (
		string extends keyof U
			? T
			: U
	);

type NotNullableKeys<T> = {
	[P in keyof T]-?: IsOptional<T[P]> extends true ? never : P
}[keyof T];

type NullableKeys<T> = {
	[P in keyof T]-?: IsOptional<T[P]> extends true ? P : never
}[keyof T];

type NotKeyWithValueObjectWithAllOption<T> = {
	[P in keyof T]-?: IsAllOptional<T[P]> extends true ? never : P
}[keyof T];

type KeyWithValueObjectWithAllOption<T> = {
	[P in keyof T]-?: IsAllOptional<T[P]> extends true ? P : never
}[keyof T];

export type MakeObjectOptional<T> = {
	[K in NotKeyWithValueObjectWithAllOption<T>]-?: T[K] extends object 
		? MakeObjectOptional<T[K]>
		: T[K]
} & {
	[K in KeyWithValueObjectWithAllOption<T>]?: T[K] extends object 
		? MakeObjectOptional<T[K]>
		: T[K]
};

export type MakeUndefinedOptional<T> = {
	[K in NotNullableKeys<T>]: T[K] extends object ? MakeUndefinedOptional<T[K]> : T[K]
} & {
	[K in NullableKeys<T>]?: T[K] extends object ? MakeUndefinedOptional<T[K]> : T[K]
};

export type PickValue<T extends Record<string, any>, K extends string> = T[K];
