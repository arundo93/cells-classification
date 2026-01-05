import type {FetchConfig, FetchFunction} from '../fetch';

export function withErrorLogger(fetch: FetchFunction) {
	return function _fetch(config: FetchConfig) {
		return fetch(config).catch(async (err: Error | Response) => {
			if (err instanceof Error) {
				const cause = err.cause as {code?: string} | undefined;
				console.log(`${err.message}: ${err.name}: ${cause?.code ?? ''}`);
			}
			throw err;
		});
	};
}
