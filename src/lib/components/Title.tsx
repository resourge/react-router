import React, { memo } from 'react';

type Props = {
	children?: string
}

/**
 * Component to update page title.
 * Route is prepared to set title using routeMetadata on component
 */
const Title = memo<Props>(({ children }) => {
	if ( children ) {
		document.title = children;
	}

	return (<></>);
});

Title.displayName = 'Title';

export default Title;
