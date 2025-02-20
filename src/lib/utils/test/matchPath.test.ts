/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, it, expect } from 'vitest';

import { matchRoute } from '../../hooks/useMatchPath';
import { ORIGIN } from '../constants';
import { matchPath } from '../matchPath';

import 'urlpattern-polyfill';

const createBaseUrl = (path: string) => {
	return new URL(path, ORIGIN);
};

describe('matchPath', () => {
	describe('path', () => {
		it('base /', () => {
			const matchBase = matchPath(
				createBaseUrl('/'), 
				{
					baseURL: ORIGIN,
					path: '/'
				}
			);

			expect(matchBase).not.toBeNull();
		});

		it('pathname', () => {
			const a = createBaseUrl('/products/1460/test?id=10#/hash');
			const matchResult = undefined;
			const baseContext = undefined;
			const matchProps = {
				baseURL: ORIGIN,
				path: '/products/:productId{/:productName}?'
			};
			const match = matchResult ?? matchRoute(
				a, 
				matchProps,
				matchProps.path, 
				baseContext
			);

			expect(match).not.toBeNull();

			expect(match!.getParams()).toMatchObject({
				productId: '1460',
				productName: 'test'
			});
		});
	});

	describe('hash', () => {
		it('without pathname', () => {
			const match = matchPath(
				createBaseUrl('#/products/1460?id=10#/hash'), 
				{
					baseURL: ORIGIN,
					hash: true,
					path: '#/products/:productId'
				}
			);

			expect(match).not.toBeNull();

			expect(match!.getParams()).toMatchObject({
				productId: '1460' 
			});
		});

		it('with pathname', () => {
			const match = matchPath(
				createBaseUrl('/products/1470#/products/1460?id=10#/hash'), 
				{
					baseURL: ORIGIN,
					hash: true,
					path: '#/products/:productId'
				}
			);

			expect(match).not.toBeNull();

			expect(match!.getParams()).toMatchObject({
				productId: '1460' 
			});
		});
	});
});
