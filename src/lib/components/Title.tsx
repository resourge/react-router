import { memo } from 'react';

type TitleProps = {
	children?: string
};

/**
 * Component to update page title.
 * Route is prepared to set title using routeMetadata on component
 * Temporary till React 19 introduces component title
 */
const Title = memo<TitleProps>(({ children }) => {
	if ( children ) {
		document.title = children;
	}

	return (<></>);
});

Title.displayName = 'Title';

export default Title;
