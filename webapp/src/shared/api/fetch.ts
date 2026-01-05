import {config} from '../config';
import {withDefaultConfig} from './middleware';

export type FetchConfig<FetchRequest> = Omit<RequestInit, 'body'> & {
	url: string;
	body?: FetchRequest;
};

export function fetch<FetchRequest extends RequestInit['body']>(
	config: FetchConfig<FetchRequest>,
) {
	const {url, ...init} = config;
	return globalThis.fetch(url, init).catch(async (err: Error | Response) => {
		if (err instanceof Error) {
			const cause = err.cause as {code?: string} | undefined;
			console.log(
				`Fetch error: ${err.name}: ${err.message}${cause?.code ?? ''}`,
			);
		}
		throw err;
	});
}

export type FetchFunction = typeof fetch;

export const aiInferenceFetch = withDefaultConfig(fetch, {
	host: config.aiInference.host,
});
