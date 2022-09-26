import React from 'react'

import {
	BrowserRouter,
	Link,
	Route,
	Switch,
	Navigate,
	path,
	Redirect,
	SetupPaths
} from '@resourge/react-router'

const ProductList = React.lazy(() => import('./ProductList'));
const ProductForm = React.lazy(() => import('./ProductForm'));

const RoutePaths = SetupPaths({
	HOME: path(),
	PRODUCT: path('product')
	.routes({
		FORM: path().param('productId')
	})
})

function App() {
	return (
		<BrowserRouter>
			<button onClick={() => {
				window.history.pushState(null, '', RoutePaths.HOME.get())
			}}
			>
				Home
			</button>
			<Link
				to={RoutePaths.PRODUCT.get()}
			>
				Product List
			</Link>
			<Link
				to={
					RoutePaths.PRODUCT.FORM.get({
						productId: Math.random().toFixed(0)
					})
				}
			>
				Product
			</Link>
			<Switch>
				<Route path={RoutePaths.HOME.path}>
					Home
				</Route>
				<Route 
					path={RoutePaths.PRODUCT.path}
				>
					<ProductList />
				</Route>
				<Route path={RoutePaths.PRODUCT.FORM.path}>
					<ProductForm />
				</Route>
				{/* Redirect */}
				<Redirect from={'*'} to={RoutePaths.HOME.get()} />
				{/* OR */}
				<Navigate to={RoutePaths.HOME.get()} />
				{/* Redirect */}
			</Switch>
		</BrowserRouter>
	)
}

export default App
