export type RemoveUndefined<T extends Record<string, any> | undefined> = {
	[K in keyof T as undefined extends T[K] ? never : K]: T[K]
}

export type IsAllOptional<T extends Record<string, any> | undefined> = keyof RemoveUndefined<T> extends never ? true : false 

export type MergeValueOfUIntoT<T extends Record<string, any>, U extends Record<string, any>> = {
	[K in keyof T & keyof U]: undefined extends U[K]
		? string
		: U[K]
}
