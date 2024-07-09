import { type ReactNode, Suspense, type FC } from 'react';

import { useDefaultFallbackContext } from '../../contexts/DefaultFallbackContext';
import { type UseSwitchProps, useSwitch } from '../../hooks/useSwitch/useSwitch';

export type SwitchProps = UseSwitchProps & {
	fallback?: ReactNode
};

/**
 * Component that makes sure the first matching path renders.
 *
 * Note: This component mainly uses `useSwitch` hook.
 */
const Switch: FC<SwitchProps> = (props: SwitchProps) => {
	const child = useSwitch(props);
	const defaultFallback = useDefaultFallbackContext();

	return (
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		<Suspense fallback={props.fallback || defaultFallback}>
			{ child }
		</Suspense>
	);
};

export default Switch;
