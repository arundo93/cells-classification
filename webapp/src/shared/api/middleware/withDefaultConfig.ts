import type {FetchConfig, FetchFunction} from '../fetch';

type DefaultConfig = Partial<{
	host: string;
	headers: Headers | (() => Promise<Headers>);
}>;

export function withDefaultConfig(fetch: FetchFunction, config: DefaultConfig) {
	return async function _fetch<FetchRequest = unknown, FetchResponse = unknown>(
		_config: FetchConfig<FetchRequest>,
	) {
		const {host, headers} = config;
		const requestHeaders =
			typeof headers === 'function' ? await headers : headers;

		return fetch({
			..._config,
			url: `${host}${_config.url}`,
			headers: {..._config.headers, ...requestHeaders},
			body: JSON.stringify(_config.body),
		}).then<FetchResponse>((response) => response.json());
	};
}
