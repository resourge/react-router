import { type ReactNode, useEffect } from 'react';

import { useIsFocused } from '../../contexts/IsFocusedContext';
import { HeaderConfigEvent } from '../headerConfig/HeaderConfig.native';

export type HeaderProps = {
	children?: ReactNode
	/**
	 * String that can be displayed in the header as a fallback for `headerTitle`.
	 */
	title?: ReactNode | string
	titlePlacement?: HeaderTitlePlacement
};

export type HeaderTitlePlacement = 'center' | 'left' | 'right';

const Header = (props: HeaderProps) => {
	const isFocused = useIsFocused();
	
	useEffect(() => {
		if ( isFocused ) {
			HeaderConfigEvent(props);
		}
	}, [isFocused]);

	return (null);
};
export default Header;
