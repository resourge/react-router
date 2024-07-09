import { type ReactNode, useEffect } from 'react';

import { useIsFocused } from '../../contexts/IsFocusedContext';
import { HeaderConfigEvent } from '../headerConfig/HeaderConfig.native';

export type HeaderTitlePlacement = 'left' | 'right' | 'center';

export type HeaderProps = {
	children?: ReactNode
	/**
	 * String that can be displayed in the header as a fallback for `headerTitle`.
	 */
	title?: string | ReactNode
	titlePlacement?: HeaderTitlePlacement
};

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
