import {
	Suspense,
	type FC,
	type ReactElement,
	type ReactNode
} from 'react'

import { useSwitch } from '../hooks/useSwitch';

import { type BaseRouteProps } from './Route';

export type SwitchProps = {
	children: Array<ReactElement<BaseRouteProps>> | ReactElement<BaseRouteProps>
	fallback?: ReactNode
}

/**
 * Component that makes sure the first matching path renders.
 *
 * Note: This component mainly uses `useSwitch` hook.
 */
const Switch: FC<SwitchProps> = ({ children, fallback }: SwitchProps) => {
	const child = useSwitch(children);

	return (
		<Suspense fallback={fallback}>
			{ child }
		</Suspense>
	)
};

export default Switch;
