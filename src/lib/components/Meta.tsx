import { memo, useState } from 'react';

type MetaProps = Record<string, string>;

const useElement = (props: Record<string, string>) => {
	const [element] = useState(() => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const key = Object.keys(props).find((key) => key !== 'content')!;

		const metaElement = document.querySelector(
			`meta[${key}="${props[key]}"]`
		) ?? document.createElement('meta');

		// Append the meta elements to the document head
		document.head.appendChild(metaElement);

		return metaElement;
	});

	return element;
};

/**
 * Component to update meta tags.
 * Route is prepared to set meta tags using routeMetadata on component
 */
const Meta = memo<MetaProps>((props) => {
	const metaElement = useElement(props);

	Object.keys(props)
	.forEach((key) => {
		metaElement.setAttribute(key, props[key]);
	});

	return (<></>);
});

Meta.displayName = 'Meta';

export default Meta;
