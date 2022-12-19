
import { FunctionComponent, Suspense } from 'react';

import ErrorBoundary from './ErrorBoundary';
import LazyRoute, { LazyComponent } from './LazyRoute';
import { BrowserRouter } from './lib';

const wrapPromise = (promise: () => Promise<any>) => {
	let status = 'pending';
	let result: LazyComponent;
	const suspend = promise().then(
		(res) => {
			status = 'success';
			result = res;
		},
		(err) => {
			status = 'error';
			result = err;
		}
	);
	return {
		promise,
		read(): any {
			if (status === 'pending') {
				// eslint-disable-next-line @typescript-eslint/no-throw-literal
				throw suspend;
			}
			else if (status === 'error') {
				// eslint-disable-next-line @typescript-eslint/no-throw-literal
				throw result;
			}
			else if (status === 'success') {
				return result;
			}
		}
	};
};

const a = wrapPromise(() => import('./Test'))

function App() {
	return (
		<ErrorBoundary>
			<Suspense fallback={(
				<div style={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100vw',
					height: '100vh',
					backgroundColor: 'rgba(0,0,0,0.2)',
					display: 'flex',
					justifyContent: 'center'
				}}
				>
					Loading...
				</div>
			)}
			>
				<BrowserRouter>
					<LazyRoute 
						lazyComponent={a}
						path=':id/:name'
					/>
				</BrowserRouter>
			</Suspense>
			<button onClick={() => window.history.pushState(null, '', `http://127.0.0.1:5173/${Math.random() * 10}/Rafeal`)}>
				Change Text
			</button>
		</ErrorBoundary>
	)
}

export default App
