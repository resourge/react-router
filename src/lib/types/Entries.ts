/**
 * Convert union U to an intersection comprised of each constituent type of U
 *
 * e.g. UnionToIntersection<1 | 2 | 3> // 1 & 2 & 3
 */
type UnionToIntersection<U> =
  (U extends unknown ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

/**
 * Return the last constituent type of union T
 * ex. UnionPop<1 | 2 | 3> // 3
 */
type UnionPop<T> = FunctionalIntersection<T> extends ((_: infer U) => void) ? U : never
type FunctionalIntersection<T> = UnionToIntersection<FunctionalUnion<T>>
type FunctionalUnion<T> = T extends unknown ? (_: T) => void : never

/**
 * Return a new tuple with H prepended to T
 * ex. TupleUnshift<1, [ 2, 3 ]> // [ 1, 2, 3 ]
 */
type TupleUnshift<H, T extends unknown[]> =
  ((head: H, ...tail: T) => void) extends ((..._: infer U) => void) ? U : never

/**
 * Return a tuple composed of each constituent type of union U
 * ex. UnionToTuple<1 | 2 | 3> // [ 1, 2, 3 ]
 *     UnionToTuple<1 | 2 | 3, [ 4 ]> // [ 1, 2, 3, 4 ]
 *
 * Since recursion is used to instantiate this type, surprising things happen when passing
 * larger unions (22+ constituents). TypeScript begins to detect that the result _may_
 * cause an infinite recursion, and bails out by giving an `any` type.
 */
type UnionToTuple<T, R extends unknown[] = []> = {
	next: UnionPop<T> extends infer Tail
		? UnionToTuple<Exclude<T, Tail>, TupleUnshift<Tail, R>> : never
	result: R
}[[T] extends [never] ? 'result' : 'next']

export type Entries<T> = UnionToTuple<{
	[K in keyof T]: [K]
}[keyof T]>
