import { FC, ReactElement } from 'react';

import { useSwitch } from '../hooks/useSwitch';

import { BaseRouteProps } from './Route';

export type SwitchProps = {
	children: Array<ReactElement<BaseRouteProps>> | ReactElement<BaseRouteProps>
}

/**
 * Component that makes sure the first matching path renders.
 *
 * Note: This component mainly uses `useSwitch` hook.
 */
const Switch: FC<SwitchProps> = ({ children }: SwitchProps) => {
	return useSwitch(children);
};

export default Switch;
