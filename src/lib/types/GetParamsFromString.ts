/* eslint-disable @typescript-eslint/no-unused-vars */

type GetParamsFromString<S extends string> = S extends `${infer E}/${infer R}` 
	? [...GetParamsFromString<E>, ...GetParamsFromString<R>]
	: S extends `:${infer E}` 
		? [E]
		: []

type TransformStringIntoObj<S extends string, P extends string[] = GetParamsFromString<S>> = P extends [] 
	? never
	: P[number] extends `${infer E}?` 
		? {
			[K in E]?: any
		}
		: {
			[K in P[number]]: any
		}

type A = TransformStringIntoObj<''>
type A1 = TransformStringIntoObj<'/test'>
type A2 = TransformStringIntoObj<'/:id'>
type A3 = TransformStringIntoObj<'/:id/yetst'>
type A4 = TransformStringIntoObj<'/:id/yetst/:par'>
type A5 = TransformStringIntoObj<':id'>
type A6 = TransformStringIntoObj<':id/'>
type A7 = TransformStringIntoObj<':id/yetst'>
type A8 = TransformStringIntoObj<':id?/yetst'>
