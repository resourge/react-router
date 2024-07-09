import { type PropsWithChildren, type ReactNode } from 'react';

export type BaseRouterProps = PropsWithChildren & {
	defaultFallback?: ReactNode
};
