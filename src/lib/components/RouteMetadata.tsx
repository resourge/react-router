import { useRouteMetadata } from '../hooks';
import { type RouteMetadataType } from '../types/RouteMetadataType';

function RouteMetadata({ metadata }: { metadata: RouteMetadataType }) {
	useRouteMetadata(metadata);

	return (
		<></>
	);
};

export default RouteMetadata;
