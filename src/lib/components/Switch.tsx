import { FC, ReactNode } from 'react';

import { useSwitch } from '../hooks/useSwitch';

export type SwitchProps = {
	children: ReactNode[]
}

/**
 * Component that makes sure the first matching path renders.
 *
 * Note: This component mainly uses `useSwitch` hook.
 */
const Switch: FC<SwitchProps> = ({ children }) => {
	const component = useSwitch(children);

	return component;
};

export default Switch;
