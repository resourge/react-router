export type RemoveUndefined<T extends Record<string, any> | undefined> = {
	[K in keyof T as undefined extends T[K] ? never : K]: T[K]
}

export type IsAllOptional<T extends Record<string, any> | undefined> = keyof RemoveUndefined<T> extends never ? true : false 
