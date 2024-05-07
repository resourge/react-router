import { useMemo } from 'react';

import { useRoute } from '../contexts/RouteContext';
import { type StringifyObjectParams } from '../types/StringifyObjectParams';

export type TransformParams<Params extends Record<string, string> = Record<string, string>> = (params: StringifyObjectParams<Params>) => Params;

/**
 * Returns the current route params
 *
 * @param transformsParams Method to transform the params
 */
export const useParams = <Params extends Record<string, string> = Record<string, string>>(
	transformsParams: TransformParams<Params> = (params) => params as Params
): Params => {
	const route = useRoute<Params>();

	return useMemo(() => transformsParams({
		...route.getParams()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}), [route.unique]);
};
