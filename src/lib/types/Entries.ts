type UnionToIntersection<U> = (U extends never ? never : (arg: U) => never) extends (arg: infer I) => void
	? I
	: never;

type UnionToTuple<T, A extends any[] = []> = UnionToIntersection<T extends never ? never : (t: T) => T> extends (_: never) => infer W
	? UnionToTuple<Exclude<T, W>, [...A, W]>
	: A;

export type Entries<T> = UnionToTuple<{
	[K in keyof T]: [K, T[K]]
}[keyof T]>
