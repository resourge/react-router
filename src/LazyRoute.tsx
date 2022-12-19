/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */
import React, {
	createContext,
	FunctionComponent,
	memo,
	Suspense,
	useCallback,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
	useSyncExternalStore
} from 'react'

import ErrorBoundary from './ErrorBoundary';
import { useMatchRoute, useParams } from './lib';
import Route, { IRouteProps, RouteProps } from './lib/components/Route';
import { RouteContext, useRoute } from './lib/contexts/RouteContext';
import { validateRouteProps } from './lib/utils/validateRouteProps';

export type LazyComponent = {
	promise: () => Promise<{
		default: FunctionComponent<any>
	}>
	read: () => { default: FunctionComponent<any>, loader: any }
}

type Props = {
	lazyComponent: LazyComponent
}

const LazyRouteContext = createContext<any>(null);

export const useLazyRoute = () => useContext(LazyRouteContext)

const notifications = new Map<string, () => void>()

const LazyRoute3: React.FC<{
	id: string
	loader: any
	zxc: any
}> = memo(({
	id, loader, zxc 
}) => {
	const params = useParams();

	loader.read1()
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const h = notifications.get(id)!;
	if ( h ) {
		h();
	}

	const { q } = zxc;

	const deps = q.map((key: string) => params[key]).filter((value: any) => value);

	const qwe = useRef(deps);

	if ( !qwe.current.some((value: any, index: number) => deps[index] === value) ) {
		qwe.current = deps;
		loader.test1(params)
	}

	return (
		null
	);
}, () => true);

const LazyRoute2: React.FC<Props> = ({ lazyComponent }: Props) => {
	const a = lazyComponent.read();

	const id = useId();
	const params = useParams();

	const { default: Component, loader } = a;

	const zxc = useSyncExternalStore(
		useCallback((onStoreChange: () => void) => {
			notifications.set(id, onStoreChange)
			return () => {
				notifications.delete(id)
			}
		}, []),
		() => loader.read(params)
	);

	console.log('zxc', zxc)

	return (
		<>
			<LazyRouteContext.Provider 
				value={{
					data: zxc.res 
				}}
			>
				<Component />
			</LazyRouteContext.Provider>
			<Suspense fallback={(
				<div style={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100vw',
					height: '100vh',
					backgroundColor: 'rgba(0,0,0,0.2)',
					display: 'flex',
					justifyContent: 'center'
				}}
				>
					Loading...
				</div>
			)}
			>
				<LazyRoute3 id={id} loader={loader} zxc={zxc} />
			</Suspense>
		</>
	);
};

const LazyRoute: React.FC<Props & Omit<RouteProps, 'children' | 'component'>> = ({ lazyComponent, ...routeProps }) => {
	return (
		<Route
			{...routeProps}
		>
			<LazyRoute2 lazyComponent={lazyComponent} />
		</Route>
	);
};

export default LazyRoute;
