/* eslint-disable react/no-multi-comp */
import React from 'react';

import BrowserRouter from '../lib/components/BrowserRouter';
import Route from '../lib/components/Route';
import { useParams } from '../lib/hooks/useParams';

const MatchedRoute: React.FC<{
	label: string
}> = ({ label }) => {
	const params = useParams()
	return (
		<>
			<br/> 
			{' '}
			{ label }
		</>
	);
};

function App() {
	const path = '/foo/:name'
	const path1 = '/modal/products'
	const path11 = '/modal/pc'
	const path2 = '/category'
	const hash = '/delivery'
	const hash1 = '/product'
	const hash2 = '/type'

	return (
		<BrowserRouter>
			<button onClick={() => {
				window.history.pushState(null, '', 'http://localhost:3000/foo/test/modal/pc/category#/delivery/product/type?test=1')
			}}
			>
				Pc
			</button>
			<button onClick={() => {
				window.history.pushState(null, '', 'http://localhost:3000/foo/test/modal/products/category#/delivery/product/type?test=1')
			}}
			>
				Products
			</button>
			<MatchedRoute label="Base Route" />
			<Route path={path}>
				<MatchedRoute label="foo Route" />
				<Route path={path1}>
					<MatchedRoute label="foo modal products Matched Route" />
					<Route hash={true} path={hash}>
						<MatchedRoute label="hash delivery Matched Route" />
						<Route hash={true} path={hash1}>
							<MatchedRoute label="hash delivery product Matched Route" />
							<Route path={path2}>
								<MatchedRoute label="foo category Matched Route" />
								<Route hash={true} path={hash2}>
									<MatchedRoute label="hash delivery product type Child Matched Route" />
								</Route>
							</Route>
						</Route>
					</Route>
				</Route>
			</Route>
		</BrowserRouter>
	)
}

export default App
