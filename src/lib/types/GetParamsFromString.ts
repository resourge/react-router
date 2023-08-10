/* eslint-disable @typescript-eslint/ban-types */
type GetParamsFromString<S extends string> = S extends `${infer E}/${infer R}` 
	? [...GetParamsFromString<E>, ...GetParamsFromString<R>]
	: S extends `:${infer E}` 
		? [E]
		: []

type MergeObjectUnion<O> = {
	[K in keyof O]: O[K]
}

type Q<P> = P extends `${infer E}?` 
	? {
		[K in E]?: any
	} : P extends string ? {
		[K in P]: any
	} : {}

type TransformArrayIntoObj<P extends string[]> = P extends [] 
	? {}
	: P extends [infer E, ...infer R]
		? Q<E> & TransformArrayIntoObj<R extends string[] ? R : []>
		: {}

export type TransformStringIntoObj<S extends string, P extends string[] = GetParamsFromString<S>> = P extends [] 
	? never
	: MergeObjectUnion<TransformArrayIntoObj<P>>
