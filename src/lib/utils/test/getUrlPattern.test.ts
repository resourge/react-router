
import {
	Param,
	path,
	type PathType,
	SetupPaths
} from 'src/lib/setupPaths'
import { type Path } from 'src/lib/setupPaths/Path'

import { getUrlPattern } from '../getUrlPattern'

const baseURL = 'http://localhost:3000';

const createBaseUrl = (path: string) => {
	return `${baseURL}${path}`
}

export enum NewFieldPositionEnum {
	ABOVE = 'above',
	BELOW = 'below'
}

const ProductIdParam = Param('productId', {
	transform: (productId: string) => Number(productId)
})

export const RoutePaths = SetupPaths({
	HOME: path(''),

	PRODUCT: path('product')
	.routes({
		CATEGORY: path('category')
		.param(ProductIdParam)
		.routes({
			TEST: path('test'),
			MODAL: path('category', {
				hashModal: true
			})
			.routes({
				ENDS_WITH_PATH: path()
				.param('index', {
					transform: (index) => Number(index)
				})
				.addPath('edit'),

				ENDS_WITH_PARAM: path()
				.param('index', {
					transform: (index) => Number(index)
				}),

				CREATE: path('create')
			})
		})
		.includeCurrentURL()
	})
})

describe('getUrlPattern', () => {
	const testPathPattern = (
		pathPattern: PathType<
			Record<string, Path<any, any, any, boolean>>,
			Record<string, any>,
			Record<string, any>
		>
	) => {
		const url = getUrlPattern({
			baseURL,
			path: pathPattern.path
		})

		const productId = 10;

		const _basePath = pathPattern.get({
			productId
		});

		const basePath = _basePath.includes('http') ? _basePath : createBaseUrl(_basePath);

		expect(
			url.test(basePath)
		).toBeTruthy();

		expect(
			url.exec(basePath)
		).toMatchObject({
			pathname: {
				groups: {
					productId: String(productId)
				}
			}
		});

		expect(
			url.exec(`${basePath}/test`)
		).toMatchObject({
			pathname: {
				groups: {
					productId: String(productId)
				}
			}
		});

		expect(
			url.exec(basePath)
		).not.toMatchObject({
			pathname: {
				groups: {
					productId: String(12)
				}
			}
		});

		expect(
			url.test(`${basePath}/test`)
		).toBeTruthy();

		expect(
			url.test(`${basePath}#/test`)
		).toBeTruthy();

		expect(
			url.test(
				createBaseUrl(
					RoutePaths.PRODUCT.CATEGORY.MODAL.CREATE.get()
				)
			)
		).toBeFalsy();
	}
	it('path', () => {
		const pathPattern = RoutePaths.PRODUCT.CATEGORY;

		testPathPattern(pathPattern as any)

		testPathPattern(RoutePaths.PRODUCT.CATEGORY.TEST as any)
	})

	const testHashPattern = (
		pathPattern: PathType<
			Record<string, Path<any, any, any, boolean>>,
			Record<string, any>,
			Record<string, any>
		>
	) => {
		const url = getUrlPattern({
			baseURL,
			path: '',
			hash: true,
			hashPath: pathPattern.path
		})

		const index = 10;

		const basePath = createBaseUrl(
			pathPattern.get({
				index
			})
		);

		expect(
			url.test(basePath)
		).toBeTruthy();

		expect(
			url.exec(`${basePath}/test`)
		).toMatchObject({
			hash: {
				groups: {
					index: String(index)
				}
			}
		});

		expect(
			url.exec(basePath)
		).toMatchObject({
			hash: {
				groups: {
					index: String(index)
				}
			}
		});

		expect(
			url.exec(basePath)
		).not.toMatchObject({
			hash: {
				groups: {
					index: String(12)
				}
			}
		});

		expect(
			url.test(`${basePath}/test`)
		).toBeTruthy();

		expect(
			url.test(`${basePath}#/test`)
		).toBeTruthy();

		expect(
			url.test(
				createBaseUrl(
					RoutePaths.PRODUCT.CATEGORY.MODAL.CREATE.get()
				)
			)
		).toBeFalsy();
	}

	it('hash', () => {
		testHashPattern(RoutePaths.PRODUCT.CATEGORY.MODAL.ENDS_WITH_PATH as any);
		testHashPattern(RoutePaths.PRODUCT.CATEGORY.MODAL.ENDS_WITH_PARAM as any);
	})
})
