import { SetupPaths, path } from './lib';

const TEST = path('test').param('test');
const TEST2 = path('test')
.searchParam<{ test: number, qwe?: string }>('qwe', 'test');

const RoutePaths = SetupPaths({
	HOME: path('home'),
	HOME1: path(),
	TEST,
	TEST2,
	TEST3: path('test3')
	.routes({
		TEST: path('test').param('test1')
	})
});

RoutePaths.HOME.get({
	searchParams: {
		test: 10
	}
});
RoutePaths.HOME.get();
// RoutePaths.TEST2.
type A = keyof typeof RoutePaths.HOME.a
type B = keyof typeof RoutePaths.TEST2.a

RoutePaths.TEST.get({
	test: 10
});
const { test } = RoutePaths.TEST.useParams(); 

RoutePaths.TEST2.get({
	searchParams: {
		test: 10
	}
});
const { qwe } = RoutePaths.TEST2.useSearchParams();

RoutePaths.TEST3.TEST.get({
	test1: 10,
	searchParams: {}
});

function App() {
	return (
		<div>
			App
		</div>
	);
}

export default App;
