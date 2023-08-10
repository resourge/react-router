
type ConstRecord <T> = {
	[P in keyof T]: T[P] extends string 
		? string extends T[P] 
			? string 
			: T[P] 
		: T[P] extends number 
			? number extends T[P] 
				? number 
				: T[P] 
			: T[P] extends boolean 
				? boolean extends T[P] 
					? boolean 
					: T[P] 
				: ConstRecord<T[P]>;
}

export type AsConst<T> = 
T extends string ? T :
	T extends number ? T :
		T extends boolean ? T :
			ConstRecord<T>
