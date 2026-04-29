import { describe, expect, it } from 'vitest';

import { Param } from '../../setupPaths/Param';
import { path, type Path, type PathType } from '../../setupPaths/path/Path';
import { SetupPaths } from '../../setupPaths/setupPaths/SetupPaths';
import { ORIGIN } from '../constants';
import { getUrlPattern } from '../getUrlPattern';

import 'urlpattern-polyfill';

const createBaseUrl = (path: string) => {
	return `${ORIGIN}${path}`;
};

export enum NewFieldPositionEnum {
	ABOVE = 'above',
	BELOW = 'below'
}

const DataSourceIdParam = Param('dataSourceId', {
	onUseParams: Number
});

const ProductIdParam = Param('productId', {
	onUseParams: Number
});

export const RoutePaths = SetupPaths({
	DATA_SOURCE: path('datasource')
	.routes({
		FORM: path()
		.param('dataSourceTab', {
			onUseParams: (dataSourceTab) => dataSourceTab 
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
	}),

	HOME: path(''),

	PRODUCT: path('product')
	.routes({
		CATEGORY: path('category')
		.param(ProductIdParam)
		.routes({
			MODAL: path('category', {
				hash: true
			})
			.routes({
				CREATE: path('create'),

				ENDS_WITH_PARAM: path()
				.param('index', {
					onUseParams: Number
				}),

				ENDS_WITH_PATH: path()
				.param('index', {
					onUseParams: Number
				})
				.addPath('edit')
			}),
			OPTIONAL_PARAM: path('test1')
			.param('id', {
				optional: true
			})
			.addPath('secondPart'),
			TEST: path('test')
		})
		.includeCurrentURL()
	})
});

describe('getUrlPattern', () => {
	const testPathPattern = (
		pathPattern: PathType<
			':productId',
			{ productId: string },
			Record<string, any>,
			undefined,
			Record<string, Path<any, string>>
		>
	) => {
		const url = getUrlPattern({
			baseURL: ORIGIN,
			path: pathPattern.path
		});

		const productId = 'Product_Name';

		const _basePath = pathPattern.get({
			productId
		});

		const basePath = _basePath.includes('http')
			? _basePath
			: createBaseUrl(_basePath);

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
	};
	it('path', () => {
		const pathPattern = RoutePaths.PRODUCT.CATEGORY;
		testPathPattern(pathPattern as any);
		testPathPattern(RoutePaths.PRODUCT.CATEGORY.TEST as any);
	});

	it('optional param', () => {
		const pathPattern = RoutePaths.PRODUCT.CATEGORY.OPTIONAL_PARAM.get({
			id: 1,
			productId: 10
		});

		expect(pathPattern)
		.toBe('/product/category/10/test1/1/secondPart');
	});

	const testHashPattern = (
		pathPattern: PathType<
			':index',
			{ index: number },
			Record<string, any>,
			undefined,
			Record<string, Path<any, string>>
		>
	) => {
		const url = getUrlPattern({
			baseURL: ORIGIN,
			hash: true,
			path: pathPattern.path
		});

		const index = 10;

		const _basePath = createBaseUrl(
			pathPattern.get({
				index
			})
		);

		const basePath = `${ORIGIN}${_basePath.slice(Math.max(0, _basePath.indexOf('#') + 1))}`;

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
	};

	it('hash', () => {
		testHashPattern(RoutePaths.PRODUCT.CATEGORY.MODAL.ENDS_WITH_PATH as any);
		testHashPattern(RoutePaths.PRODUCT.CATEGORY.MODAL.ENDS_WITH_PARAM as any);
	});
	
	it('path', () => {
		const url = getUrlPattern({
			baseURL: ORIGIN,
			path: RoutePaths.DATA_SOURCE.FORM.EDIT.path
		});

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
					areaName: undefined,
					dataSourceId: '421',
					dataSourceTab: 'areas_attributes'
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
					areaName: undefined,
					dataSourceId: '421',
					dataSourceTab: 'areas_attributes'
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
					areaName: 'A_Check_DS_Separators_S02_DIP04_Fix.Hours',
					dataSourceId: '421',
					dataSourceTab: 'areas_attributes'
				}
			}
		});
	});
});
