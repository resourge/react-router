/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { matchPath } from '../matchPath';

const baseURL = 'http://localhost:3000';

const createBaseUrl = (path: string) => {
	return new URL(path, baseURL);
};

describe('matchPath', () => {
	describe('path', () => {
		it('base /', () => {
			const matchBase = matchPath(
				createBaseUrl('/'), 
				{
					baseURL,
					path: '/'
				}
			);

			expect(matchBase).not.toBeNull();
		});

		it('pathname', () => {
			const match = matchPath(
				createBaseUrl('/products/1460?id=10#/hash'), 
				{
					baseURL,
					path: '/products/:productId'
				}
			);

			expect(match).not.toBeNull();

			expect(match!.getParams()).toMatchObject({
				productId: '1460' 
			});
		});
	});

	describe('hash', () => {
		it('without pathname', () => {
			const match = matchPath(
				createBaseUrl('#/products/1460?id=10#/hash'), 
				{
					baseURL,
					hash: true,
					path: '',
					hashPath: '#/products/:productId'
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
					baseURL,
					hash: true,
					path: '',
					hashPath: '#/products/:productId'
				}
			);

			expect(match).not.toBeNull();

			expect(match!.getParams()).toMatchObject({
				productId: '1460' 
			});
		});
	});
});
