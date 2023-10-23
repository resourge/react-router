/* eslint-disable react/no-multi-comp */
import { useEffect } from 'react';

import {
	BrowserRouter,
	Link,
	Route,
	Switch,
	useNavigate,
	useSearchParams
} from './lib';

const Test: React.FC<{ children: string }> = ({ children }) => {
	useSearchParams();
	// const a = useNavigate();
	console.log('children', children);
	useEffect(() => {
		return () => {
			console.log('und');
		};
	}, []);
	return (
		<>
			{ children }
		</>
	);
};

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route
					path="/"
					searchParams={'id'}
				>
					<Test>
						App id
					</Test>
				</Route>
				<Route
					path="/"
					searchParams={'test'}
				>
					<Test>
						App test
					</Test>
				</Route>
			</Switch>
			<Link
				replace={true}
				to="/?id=1"
			>
				Click me id
			</Link>
			<Link
				replace={true}
				to="/?id=2"
			>
				Click me id 2
			</Link>
			<Link
				replace={true}
				to="/?test=1"
			>
				Click me 2
			</Link>
		</BrowserRouter>
	);
}

export default App;
