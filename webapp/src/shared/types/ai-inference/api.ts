type HealthCheck200Response = {
	status: 'ok';
	is_full: boolean;
	tasks_count: number;
};

type ErrorBaseResponse = {
	detail: string;
};

type HealthCheck500Response = ErrorBaseResponse;

export type HealthCheckResponse =
	| HealthCheck200Response
	| HealthCheck500Response;

type Config200Response = {
	models: string[];
	class_labels: string[];
};

type Config500Response = ErrorBaseResponse;

export type ConfigResponse = Config200Response | Config500Response;

export type TaskCreateRequest = {
	studies: {
		filePath: string;
		id: string;
	}[];
	models: string[];
};

type TaskCreate200Response = {
	status: 'all' | 'partial';
	tasks_ignored: number;
};

type TaskCreate500Response = ErrorBaseResponse;

export type TaskCreateResponse = TaskCreate200Response | TaskCreate500Response;

export type TaskCreateErrorResponse = {
	status: 'error';
	error: string;
};
