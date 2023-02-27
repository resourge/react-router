import { type FC, useEffect } from 'react';

import { type NavigateOptions, useNavigate } from '../hooks/useNavigate';
import { type NavigateTo } from '../hooks/useNormalizeUrl';

export type NavigateProps = {
	to: NavigateTo
} & NavigateOptions
/**
 * Navigates to `to`.
 *
 * Note: This component mainly uses `useNavigate` hook to navigate to `to`.
 */
const Navigate: FC<NavigateProps> = ({
	to, replace = true, ...navigateOptions 
}: NavigateProps) => {
	const navigate = useNavigate()

	useEffect(() => {
		navigate(to, {
			replace,
			...navigateOptions
		})
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return null;
};

export default Navigate;
