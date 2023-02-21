export type RemoveUndefined<T extends Record<string, any> | undefined> = {
	[K in keyof T as undefined extends T[K] ? never : K]: T[K]
}

export type IsAllOptional<T extends Record<string, any> | undefined> = keyof RemoveUndefined<T> extends never ? true : false 

export type CleanObject<X extends Record<string, any>> = {
	[K in keyof X as string extends K ? never : K ]: X[K]
}

export type CleanObjects<X extends Record<string, any>, Y extends Record<string, any>> = CleanObject<{
	[K in keyof X as string extends K ? never : K ]: X[K]
} & {
	[K in keyof Y as string extends K ? never : K ]: Y[K]
}>
