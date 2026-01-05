import path from 'node:path';

import {aiInferenceFetch} from '@/shared/api/fetch';

import type {
	HealthCheckErrorResponse,
	HealthCheckResponse,
	TaskCreateErrorResponse,
	TaskCreateResponse,
} from '../../types/ai-inference';
import type {
	ConfigResponse,
	TaskCreateRequest,
} from '../../types/ai-inference/api';

export function checkInferenceServiceStatus() {
	return aiInferenceFetch<undefined, HealthCheckResponse>({
		url: '/health',
		method: 'GET',
	})
		.catch<HealthCheckErrorResponse>(async (err) => {
			const error = await err.json();
			console.log(error);
			return {
				status: 'error',
				error: error.details,
			};
		})
		.catch(() => undefined);
}

export function getOptions() {
	return aiInferenceFetch<undefined, ConfigResponse>({
		url: '/options',
		method: 'GET',
	})
		.then((data) => ({
			models: data.models,
			classLabels: data.class_labels,
		}))
		.catch(() => ({
			models: [] as string[],
			classLabels: [] as string[],
		}));
}

export function createTask(
	studies: {
		id: string;
		series: string;
		filename: string;
	}[],
	models: string[] = ['resNet50'],
) {
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
		.catch<TaskCreateErrorResponse>(async (err) => {
			const error = await err.json();
			console.log(error);
			return {
				status: 'error',
				error: error.details,
			};
		})
		.catch(() => ({
			status: 'error',
			error: 'unknown',
		}));
}
