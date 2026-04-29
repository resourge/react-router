import { describe, expect, it } from 'vitest';

import { Param } from '../../setupPaths/Param';
import { path } from '../../setupPaths/path/Path';
import { SetupPaths } from '../../setupPaths/setupPaths/SetupPaths';

import 'urlpattern-polyfill';

const DataSourceIdParam = Param('dataSourceId', {
	onUseParams: Number,
	optional: false
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
			TEST: path('test')
		})
		.includeCurrentURL()
	})
});

describe('generatePath', () => {
	it('check generatePath', () => {
		expect(
			RoutePaths.DATA_SOURCE.FORM.EDIT.get({
				areaName: 'A_Check_DS_Separators_S02_DIP04_Fix.Hours',
				dataSourceId: 421,
				dataSourceTab: 'areas_attributes'
			})
		)
		.toMatch('/datasource/areas_attributes/421/A_Check_DS_Separators_S02_DIP04_Fix.Hours');
	});
});
