import { type IsAllOptional } from '../types/types';

export type SearchParamsType = Record<string, any>;

export type SearchParamsPathType<SearchParams extends SearchParamsType | undefined> = 
	SearchParams extends undefined
		? { searchParams?: SearchParams } 
		: (
			IsAllOptional<SearchParams extends undefined ? Record<string, any> : SearchParams> extends true 
				? { searchParams?: SearchParams } 
				: { searchParams: SearchParams }
		);

export type SearchParamConfig = {
	optional?: boolean
};

export function searchParam<
	Type = string
>(): Type;
export function searchParam<
	Type = string
>(
	config: SearchParamConfig & { optional: true }
): Type | undefined;
export function searchParam<
	Type = string
>(
	config: SearchParamConfig
): Type;
export function searchParam<
	Type = string
>(
	config?: SearchParamConfig
): Type {
	return config as Type;
}
