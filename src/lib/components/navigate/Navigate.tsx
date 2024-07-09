import { type FC, useEffect } from 'react';

import { useNavigate, type NavigateOptions } from '../../hooks/useNavigate/useNavigate';
import { type NavigateTo } from '../../hooks/useNormalizeUrl/useNormalizeUrlUtils';

export type NavigateProps = {
	to: NavigateTo
} & NavigateOptions;
/**
 * Navigates to `to`.
 *
 * Note: This component mainly uses `useNavigate` hook to navigate to `to`.
 */
const Navigate: FC<NavigateProps> = ({ to, ...navigateOptions }: NavigateProps) => {
	const navigate = useNavigate();

	useEffect(() => {
		navigate(to, navigateOptions);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
};

export default Navigate;
