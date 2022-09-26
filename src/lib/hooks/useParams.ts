import { useRoute } from '../contexts/RouteContext';

export type StringifyObjectParams<T extends Record<string, any>> = {
	[Key in keyof T]: string
}

export type TransformParams<Params extends Record<string, string> = Record<string, string>> = (params: StringifyObjectParams<Params>) => Params

/**
 * Returns the current route params
 *
 * @param transformsParams Method to transform the params
 */
export const useParams = <Params extends Record<string, string> = Record<string, string>>(
	transformsParams: TransformParams<Params> = (params) => params as Params
): Params => {
	const route = useRoute<Params>();

	const params: StringifyObjectParams<Params> = {
		...route.params
	};

	return transformsParams(params)
}
