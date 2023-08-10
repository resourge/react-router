/* eslint-disable @typescript-eslint/no-unused-expressions */
import { SetupPaths, path } from './lib'

const Routes = SetupPaths({
	id: path('id'),
	name: path('name'),
	test: path('test')
	.routes({
		test1: path('test1'),
		test2: path('test2').param('id')
	}),
	test2: path('test2', {
		hash: true
	}),
	test3: path('test3').param('optional', {
		optional: true 
	}),
	idParam: path().param('id')
	.routes({
		test1: path('test1').param('asd'),
		test2: path('test2').param('id', { }),
		test3: path('test3', {
			hash: true 
		}),
		test5: path('test5', {
			hash: true
		}).routes({
			test1: path('test1'),
			test3: path('test3', {
				hash: true 
			})
		})

	})
})

Routes.id.path
Routes.name.path
Routes.test3.path
Routes.test3.get({
	optional
})
Routes.idParam.get({
	id: '123'
})
Routes.idParam.test1.path
Routes.idParam.test1.get({
	id: '123' as const,
	asd: '123' as const
})
Routes.idParam.test3.path
Routes.idParam.test5.test1.path
Routes.idParam.test5.test3.path
Routes.test.path
Routes.test2.path
Routes.test.test1.path
Routes.test.test2.path
Routes.test.test2.get({
	id: 'asdqwdadsasda' as const
})

console.log('Routes', Routes)

function App() {
	return (
		<div>
		</div>
	)
}

export default App
