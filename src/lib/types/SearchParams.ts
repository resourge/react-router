import { type ParamsConfigOptional } from '../setupPaths/Param';

import { type IsAllOptional } from './types';

export type BaseSearchParams = Pick<ParamsConfigOptional, 'onGet' | 'onUseParams'>

export type SearchParamsType = Record<string, any>;

export type SearchParamsPathType<SearchParams extends SearchParamsType | undefined> = 
	SearchParams extends undefined
		? { searchParams?: SearchParams } 
		: string[] extends SearchParams 
			? { searchParams?: SearchParams } 
			: (
				IsAllOptional<SearchParams extends undefined ? Record<string, any> : SearchParams> extends true 
					? { searchParams?: SearchParams } 
					: { searchParams: SearchParams }
			)
