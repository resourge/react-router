import { memo, useState, type MetaHTMLAttributes } from 'react';

type MetaProps = MetaHTMLAttributes<HTMLMetaElement>;

const useElement = (props: MetaProps) => {
	const [element] = useState(() => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const key = Object.keys(props).find((key) => key !== 'content')!;

		const metaElement = document.querySelector(
			`meta[${key}="${props[key as keyof MetaProps]}"]`
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
 * Temporary till React 19 introduces component title
 */
const Meta = memo<MetaProps>((props) => {
	const metaElement = useElement(props);

	Object.keys(props)
	.filter((key) => props[key as keyof MetaProps])
	.forEach((key) => {
		metaElement.setAttribute(key, String(props[key as keyof MetaProps]));
	});

	return (<></>);
});

Meta.displayName = 'Meta';

export default Meta;
