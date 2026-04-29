import { type FC, useEffect } from 'react';

import { type NavigateOptions } from '@resourge/history-store/mobile';

import { useNavigate } from '../../hooks/useNavigate/useNavigate.native';
import { type NavigateTo } from '../../hooks/useNormalizeUrl/useNormalizeUrlUtils';

export type NavigateProps = NavigateOptions & {
	to: NavigateTo
};
/**
 * Navigates to `to`.
 *
 * Note: This component mainly uses `useNavigate` hook to navigate to `to`.
 */
const Navigate: FC<NavigateProps> = ({ to, ...navigateOptions }: NavigateProps) => {
	const navigate = useNavigate();

	useEffect(() => {
		navigate(to, navigateOptions);
	}, []);

	return null;
};

export default Navigate;
