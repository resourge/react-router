import 'react';
import { type RouteMetadataType } from './types/RouteMetadataType';

declare module 'react' {

	export interface FunctionComponent {
		routeMetadata?: RouteMetadataType
	}
}
