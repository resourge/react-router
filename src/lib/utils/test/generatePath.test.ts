import { Param } from 'src/lib/setupPaths/Param';
import { path } from 'src/lib/setupPaths/path/Path';
import { SetupPaths } from 'src/lib/setupPaths/setupPaths/SetupPaths';

import 'urlpattern-polyfill';

const DataSourceIdParam = Param('dataSourceId', {
	optional: false,
	onUseParams: (dataSourceId: string) => Number(dataSourceId)
});

const ProductIdParam = Param('productId', {
	onUseParams: (productId: string) => Number(productId)
});

export const RoutePaths = SetupPaths({
	HOME: path(''),

	PRODUCT: path('product')
	.routes({
		CATEGORY: path('category')
		.param(ProductIdParam)
		.routes({
			TEST: path('test'),
			MODAL: path('category', {
				hash: true
			})
			.routes({
				ENDS_WITH_PATH: path()
				.param('index', {
					onUseParams: (index) => Number(index)
				})
				.addPath('edit'),

				ENDS_WITH_PARAM: path()
				.param('index', {
					onUseParams: (index) => Number(index)
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
	})
});

describe('generatePath', () => {
	it('check generatePath', () => {
		expect(
			RoutePaths.DATA_SOURCE.FORM.EDIT.get({
				dataSourceTab: 'areas_attributes',
				dataSourceId: 421,
				areaName: 'A_Check_DS_Separators_S02_DIP04_Fix.Hours'
			})
		)
		.toMatch('/datasource/areas_attributes/421/A_Check_DS_Separators_S02_DIP04_Fix.Hours');
	});
});
