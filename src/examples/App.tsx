/* eslint-disable react/no-multi-comp */
import React from 'react';

import { path, SetupPaths } from '../lib';
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

const a = SetupPaths({
	HOME: path(''),
	LOGIN: path('login'),
	TEST: path('test')
	.param('id', {
		beforePath: (id) => {
			return (Number(id) * 10).toFixed(0)
		},
		transform: (id) => {
			return `Test_${id}`
		}
	}),
	TEST2: path('test2'),
	TEMPLATE_MODAL: path('template', {
		hashModal: true 
	})
});

console.log('a', a.TEST.path)
console.log('a', a.TEST.get({
	id: '1' 
}))

function App() {
	const path = '/foo/:name'
	const path1 = '/modal/products'
	const path11 = '/modal/pc'
	const path2 = '/category'
	const hash = '#/delivery'
	const hash1 = '#/product'
	const hash2 = '#/type'

	return (
		<BrowserRouter>
			<button onClick={() => {
				window.history.pushState(null, '', 'http://127.0.0.1:5173/foo/test/modal/pc/category#/delivery/product/type?test=1')
			}}
			>
				Pc
			</button>
			<button onClick={() => {
				window.history.pushState(null, '', 'http://127.0.0.1:5173/foo/test/modal/products/category#/delivery/product/type?test=1')
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

/*
import {
	BrowserRouter,
	Route,
	SetupPaths,
	path
} from './lib'
import BaseRoute from './lib/components/BaseRoute'

const Routes = SetupPaths({
	id: path('id'),
	name: path('name'),
	idParam: path('').param('id')
})

console.log('Routes', Routes)

function App() {
	return (
		<BrowserRouter>
			<Route path={Routes.id.path}>
				<div>Id</div>
				<Route path={Routes.name.path}>
					<div>Name</div>
					<BaseRoute
						base={Routes.idParam.path}
						params={{
							check: ({ id }) => {
								if ( id === 'fr' ) {
									return 'REMOVE_CURRENT_PARAMS'
								}
								return id === 'en' || id === 'pt'
							},
							fallback: () => {
								return {
									id: 'pt'
								}
							}
						}}
					>
						<div>Test</div>
					</BaseRoute>
				</Route>
			</Route>
		</BrowserRouter>
	)
}

export default App

*/
