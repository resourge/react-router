
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

const DataSourceIdParam = Param('dataSourceId', {
	transform: (dataSourceId: string) => Number(dataSourceId)
})

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
	}),

	DATA_SOURCE: path('datasource')
	.routes({
		FORM: path()
		.param('dataSourceTab', {
			transform: (dataSourceTab) => dataSourceTab as any
		})
		.routes({
			CREATE: path('')
			.addPath('create')
			.includeCurrentURL(),

			EDIT: path('')
			.param(DataSourceIdParam)
			.param('areaName', {
				optional: true
			})
			.includeCurrentURL()
		})
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

		const productId = 'Product_Name';

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

		const _basePath = createBaseUrl(
			pathPattern.get({
				index
			})
		);

		const basePath = `${baseURL}${_basePath.substring(_basePath.indexOf('#') + 1)}`

		expect(
			url.test(basePath)
		).toBeTruthy();

		expect(
			url.exec(`${basePath}/test`)
		).toMatchObject({
			pathname: {
				groups: {
					index: String(index)
				}
			}
		});

		expect(
			url.exec(basePath)
		).toMatchObject({
			pathname: {
				groups: {
					index: String(index)
				}
			}
		});

		expect(
			url.exec(basePath)
		).not.toMatchObject({
			pathname: {
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
	}

	it('hash', () => {
		testHashPattern(RoutePaths.PRODUCT.CATEGORY.MODAL.ENDS_WITH_PATH as any);
		testHashPattern(RoutePaths.PRODUCT.CATEGORY.MODAL.ENDS_WITH_PARAM as any);
	})
	
	it('path', () => {
		const url = getUrlPattern({
			baseURL,
			path: RoutePaths.DATA_SOURCE.FORM.EDIT.path
		})

		expect(
			url.test(
				createBaseUrl('/')
			)
		).toBeFalsy();

		expect(
			url.test(
				createBaseUrl('/datasource/areas_attributes/421')
			)
		).toBeTruthy();

		expect(
			url.exec(
				createBaseUrl('/datasource/areas_attributes/421#')
			)
		).toMatchObject({
			pathname: {
				groups: {
					dataSourceTab: 'areas_attributes',
					dataSourceId: '421',
					areaName: undefined
				}
			}
		});

		expect(
			url.test(
				createBaseUrl('/datasource/areas_attributes/421/')
			)
		).toBeTruthy();

		expect(
			url.exec(
				createBaseUrl('/datasource/areas_attributes/421/')
			)
		).toMatchObject({
			pathname: {
				groups: {
					dataSourceTab: 'areas_attributes',
					dataSourceId: '421',
					areaName: undefined
				}
			}
		});

		expect(
			url.test(
				createBaseUrl('/datasource/areas_attributes/421#/datasource')
			)
		).toBeTruthy();

		expect(
			url.test(
				createBaseUrl('/datasource/areas_attributes/421/A_Check_DS_Separators_S02_DIP04_Fix.Hours#/datasource')
			)
		).toBeTruthy();

		expect(
			url.exec(
				createBaseUrl('/datasource/areas_attributes/421/A_Check_DS_Separators_S02_DIP04_Fix.Hours#/datasource')
			)
		).toMatchObject({
			pathname: {
				groups: {
					dataSourceTab: 'areas_attributes',
					dataSourceId: '421',
					areaName: 'A_Check_DS_Separators_S02_DIP04_Fix.Hours'
				}
			}
		});
	})
})