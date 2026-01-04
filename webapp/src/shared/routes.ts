type ExtractDynamic<Path extends string> = Path extends `[${infer Sub}]`
	? Sub
	: never;

type ExtractParams<Path extends string> =
	Path extends `${infer Left}/${infer Right}`
		? ExtractParams<Left> | ExtractParams<Right>
		: ExtractDynamic<Path>;

type Route<Path extends string> = {
	path: string;
	url: ExtractParams<Path> extends never
		? (params?: {query?: Record<string, string>}) => string
		: (
				params: Record<ExtractParams<Path>, string> & {
					query?: Record<string, string>;
				},
			) => string;
};

function makeRoute<Path extends string>(path: Path): Route<Path> {
	const pathString = path.toString();
	return {
		path: pathString,
		url: (params = {}) => {
			const {query, ...dynamicParams} =
				'query' in params ? params : {query: {}, ...params};
			const searchParams = new URLSearchParams(
				query as Record<string, string>,
			).toString();
			const parsedPath = Object.entries(dynamicParams).reduce(
				(acc, [param, value]) => acc.replace(`[${param}]`, value as string),
				pathString,
			);
			return `${parsedPath}${searchParams ? `?${searchParams}` : ''}`;
		},
	};
}

export const routes = {
	home: makeRoute('/'),
	models: makeRoute('/models'),
	studies: makeRoute('/studies'),
	study: makeRoute('/studies/[id]'),
	studyImage: makeRoute('/api/studies/[id]/image'),
	createStudy: makeRoute('/studies/create'),
	settings: makeRoute('/settings'),
};
