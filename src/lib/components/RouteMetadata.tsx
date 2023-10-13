import { type ReactNode } from 'react';

import { useRouteMetadata } from '../hooks';
import { type RouteMetadataType } from '../types/RouteMetadataType';

function RouteMetadata({ children }: { children: ReactNode }) {
	const metadata: RouteMetadataType = (children as any)?.type?._payload?._result?.default?.routeMetadata 
	useRouteMetadata(metadata);

	return (
		<>
			{ children }
		</>
	);
};

export default RouteMetadata;
