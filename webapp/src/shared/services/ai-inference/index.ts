import path from 'node:path';

import {aiInferenceFetch} from '@/shared/api/fetch';

import type {
	HealthCheckResponse,
	TaskCreateResponse,
} from '../../types/ai-inference';
import type {
	ConfigResponse,
	TaskCreateRequest,
} from '../../types/ai-inference/api';
import type {
	CheckInferenceServiceStatus,
	Options,
	TaskCreateResult,
} from './types';

export function checkInferenceServiceStatus() {
	const defaultStatus: CheckInferenceServiceStatus = {
		status: 'error',
		isFull: true,
	};

	return aiInferenceFetch<undefined, HealthCheckResponse>({
		url: '/health',
		method: 'GET',
	})
		.then<CheckInferenceServiceStatus>((response) =>
			'status' in response
				? {
						...response,
						status: response.status,
					}
				: defaultStatus,
		)
		.catch(() => defaultStatus);
}

export function getOptions() {
	const defaultOptions: Options = {
		models: [],
		classLabels: [],
	};

	return aiInferenceFetch<undefined, ConfigResponse>({
		url: '/options',
		method: 'GET',
	})
		.then<Options>((data) =>
			'models' in data
				? {
						models: data.models,
						classLabels: data.class_labels,
					}
				: defaultOptions,
		)
		.catch<Options>(() => defaultOptions);
}

export function createTask(
	studies: {
		id: string;
		series: string;
		filename: string;
	}[],
	models: string[] = ['resNet50'],
) {
	const defaultTaskStatus: TaskCreateResult = {
		status: 'error',
	};

	return aiInferenceFetch<TaskCreateRequest, TaskCreateResponse>({
		url: '/task/create',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: {
			studies: studies.map(({id, series, filename}) => ({
				filePath: path.join(series, filename),
				id,
			})),
			models,
		},
	})
		.then((data) =>
			'status' in data ? {status: data.status} : defaultTaskStatus,
		)
		.catch(() => defaultTaskStatus);
}
