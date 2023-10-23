import { type Entries } from './Entries';

type ArrayToSearchParams<T extends any[]> = T extends any[] 
	? T extends [infer E, ...infer R]
		? E extends [infer Key, infer Value]
			? `${Key extends string ? Key : ''}=${Value extends string | number | bigint | boolean ? `${Value}` : ''}${ArrayToSearchParams<R> extends '' ? '' : `&${ArrayToSearchParams<R>}`}`
			: ''
		: ''
	: ''

export type ObjectToSearchParams<SP extends Record<string, any>> = ArrayToSearchParams<Entries<SP>>;
