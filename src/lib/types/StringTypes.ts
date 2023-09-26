export type IsString<T> = T extends string 
	? T extends ''
		? false
		: true
	: false

export type IncludeSlash<T extends string> = IsString<T> extends true 
	? T extends `/${string}`
		? T
		: `/${T}` 
	: ''
	
export type ResolveSlash<Args> = Args extends [infer E, ...infer R] 
	? `${E extends string ? E : ''}${IsString<E> extends true ? IncludeSlash<ResolveSlash<R>> : ResolveSlash<R>}`
	: ''

export type Replace<T extends string, S extends string, D extends string,
	A extends string = ''> = T extends `${infer L}${S}${infer R}` ?
		Replace<R, S, D, `${A}${L}${D}`> : `${A}${T}`

export type IsHashPath<S> = S extends `#${string}` ? true : false

export type ParamString<T extends string> = `:${T}`;
