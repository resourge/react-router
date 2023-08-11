import { SetupPaths, path } from './lib'

const RoutePaths = SetupPaths({
	HOME: path(),
	PRODUCT: path('product')
	.routes({
		FORM: path()
		.param('productId')
	})
})

console.log('asd', RoutePaths.HOME
.withSearchParams({
	id: 10,
	test: {
		id: 10
	}
})
.get())

function App() {
	return (
		<div>
			App
		</div>
	)
}

export default App
