import { useLayoutEffect, VFC } from 'react';

import { NavigateOptions, useNavigate } from '../hooks/useNavigate';

export type NavigateProps = {
	to: string
} & NavigateOptions

/**
 * Navigates to `to`.
 *
 * Note: This component mainly uses `useNavigate` hook to navigate to `to`.
 */
const Navigate: VFC<NavigateProps> = ({ to, ...navigateOptions }) => {
	const navigate = useNavigate();

	useLayoutEffect(() => {
		navigate(to, navigateOptions)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [navigate, to])

	return null;
};

export default Navigate;
