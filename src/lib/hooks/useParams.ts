import { useRouteContext } from '../contexts/RouteContext';

export type StringifyObjectParams<T extends object> = {
	[Key in keyof T]: string
}

/**
 * Returns the current route params
 *
 * @param cb Method to transform the params
 */
export const useParams = <T extends object>(
	cb: (params: StringifyObjectParams<T>) => T = (params) => params as T
): T => {
	const routeParent = useRouteContext<StringifyObjectParams<T>>();

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	const params: StringifyObjectParams<T> = routeParent?.params ?? {} as StringifyObjectParams<T>;

	return cb(params)
}
