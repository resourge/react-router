import 'react';
import { type RouteMetadataType } from './types/RouteMetadataType';

/* eslint-disable @typescript-eslint/ban-types */
declare module 'react' {
	export interface FunctionComponent {
		routeMetadata?: RouteMetadataType
	}
}
