import React from 'react';

import { useLazyRoute } from './LazyRoute';
import { useRoute } from './lib';

type Props = {
}

const wrapPromise = (promise: (params: any) => Promise<any>) => {
	let status: string | undefined;
	let result: any;
	let suspend: Promise<any>;

	let status1: string | undefined;
	let suspend1: Promise<any>;
	return {
		promise,
		read1: () => {
			if ( suspend1 ) {
				if (status1 === 'pending') {
					// eslint-disable-next-line @typescript-eslint/no-throw-literal
					throw suspend1;
				}
				else if (status1 === 'error') {
					// eslint-disable-next-line @typescript-eslint/no-throw-literal
					throw result;
				}
				else if (status1 === 'success') {
					return result;
				}
			}
		},
		test1: (params) => {
			const q: any[] = []

			status1 = 'pending'
			suspend1 = promise(new Proxy(params, {
				get(_, p: any) {
					q.push(p)
					return params[p]
				}
			})).then(
				(res) => {
					status1 = 'success';
					result = {
						res,
						q
					};
				},
				(err) => {
					status1 = 'error';
					result = err;
				}
			)

			// eslint-disable-next-line @typescript-eslint/no-throw-literal
			throw suspend1;
		},
		test2: async (params: any) => {
			const q: any[] = []

			const res = await promise(new Proxy(params, {
				get(_, p: any) {
					q.push(p)
					return params[p]
				}
			}))

			status = 'success';
			result = {
				res,
				q
			};
		},
		test: async (params: any) => {
			const q: any[] = []

			const res = await promise(new Proxy(params, {
				get(_, p: any) {
					q.push(p)
					return params[p]
				}
			}))

			return {
				res,
				q
			}
		},
		read(params: any) {
			if (status === undefined) {
				status = 'pending';

				const q: any[] = []
				
				suspend = promise(new Proxy(params, {
					get(_, p: any) {
						q.push(p)
						return params[p]
					}
				})).then(
					(res) => {
						status = 'success';
						result = {
							res,
							q
						};
					},
					(err) => {
						status = 'error';
						result = err;
					}
				)
				// eslint-disable-next-line @typescript-eslint/no-throw-literal
				throw suspend;
			}
			else if (status === 'pending') {
				// eslint-disable-next-line @typescript-eslint/no-throw-literal
				throw suspend;
			}
			else if (status === 'error') {
				// eslint-disable-next-line @typescript-eslint/no-throw-literal
				throw result;
			}
			else if (status === 'success') {
				return result;
			}
		}
	};
};

const sleep = (v: number) => new Promise((resolve) => setTimeout(resolve, v))

export const loader = wrapPromise(async (params: any) => {
	await sleep(10);
	return await Promise.resolve(`Test_${params.id}`)
})

const Test: React.FC<Props> = ({ }) => {
	const route = useLazyRoute();
	return (
		<>
			{ route.data }
		</>
	);
};

export default Test;
