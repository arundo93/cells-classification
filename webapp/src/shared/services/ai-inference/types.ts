export type CheckInferenceServiceStatus = {
	status: 'ok' | 'error';
	isFull?: boolean;
	tasksCount?: number;
};

export type Options = {
	models: string[];
	classLabels: string[];
};

export type TaskCreateResult = {
	status: 'all' | 'partial' | 'error';
};
