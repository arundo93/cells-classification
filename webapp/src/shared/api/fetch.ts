import {config} from '../config';
import {withDefaultConfig} from './middleware';
import {withErrorLogger} from './middleware/withErrorLogger';

export type FetchConfig = RequestInit & {
	url: string;
};

export function fetch(config: FetchConfig) {
	const {url, ...init} = config;
	return globalThis.fetch(url, init);
}

export type FetchFunction = typeof fetch;

export const aiInferenceFetch = withDefaultConfig(withErrorLogger(fetch), {
	host: config.aiInference.host,
});
