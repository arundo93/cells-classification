export type HealthCheckResponse = {
	status: 'ok';
	is_full: boolean;
	tasks_count: number;
};

export type HealthCheckErrorResponse = {
	status: 'error';
	error: string;
};

export type TaskCreateResponse = {
	status: 'all' | 'partial';
	tasks_ignored: number;
};

export type TaskCreateErrorResponse = {
	status: 'error';
	error: string;
};

export type ConfigResponse = {
	models: string[];
	classLabels: string[];
};
