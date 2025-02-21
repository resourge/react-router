import { Route, Switch } from './lib';
import Router from './lib/components/router/Router';

function App() {
	console.log('ola');
	return (
		<Router>
			<Switch>
				<Route
					index
					path="/test"
				>
					Test
				</Route>
				<Route
					path="/test2"
				>
					Test2
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
