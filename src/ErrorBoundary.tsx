import React, { Component, PropsWithChildren } from 'react';

// import ErrorScreen from 'src/pages/errorScreen/ErrorScreen';

type State = {
	hasError: boolean
}

export default class ErrorBoundary extends Component<PropsWithChildren, State> {
	static getDerivedStateFromError(_error: any) {
		console.log('error', _error)
		return {
			hasError: true 
		};
	}

	state: State = {
		hasError: false
	}

	render() {
		if ( this.state.hasError ) {
			return <>Error Screen</>;
		}

		return this.props.children;
	}
}
