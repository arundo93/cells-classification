import path from 'node:path';

import {config} from '../../config';
import type {
	HealthCheckErrorResponse,
	HealthCheckResponse,
	TaskCreateErrorResponse,
	TaskCreateResponse,
} from '../../types/ai-inference';
import type {ConfigResponse} from '../../types/ai-inference/api';

export function checkInferenceServiceStatus(): Promise<
	HealthCheckResponse | HealthCheckErrorResponse | undefined
> {
	return fetch(`${config.aiInference.host}/health`, {
		method: 'GET',
	})
		.then((response) => response.json())
		.catch(async (err: Error | Response) => {
			if (err instanceof Error) {
				const cause = err.cause as {code?: string} | undefined;
				console.error(err.message, 'cause', cause?.code);

				return undefined;
			}
			const error = await err.json();
			console.log(error);
			return {
				status: 'error',
				error: error.details,
			};
		});
}

export function getOptions(): Promise<ConfigResponse> {
	return fetch(`${config.aiInference.host}/options`, {
		method: 'GET',
	})
		.then((response) => response.json())
		.catch(async (err: Error | Response) => {
			if (err instanceof Error) {
				const cause = err.cause as {code?: string} | undefined;
				console.error(err.message, 'cause', cause?.code);

				return {
					models: [],
					class_labels: [],
				};
			}
			const error = await err.json();
			console.log(error);

			return {
				models: [],
				class_labels: [],
			};
		})
		.then((data) => ({
			classLabels: data.class_labels,
			models: data.models,
		}));
}

export function createTask(
	studies: {
		id: string;
		series: string;
		filename: string;
	}[],
	models: string[] = ['resNet50'],
): Promise<TaskCreateResponse | TaskCreateErrorResponse> {
	return fetch(`${config.aiInference.host}/task/create`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			studies: studies.map(({id, series, filename}) => ({
				filePath: path.join(series, filename),
				id,
			})),
			models,
		}),
	})
		.then((response) => response.json())
		.catch(async (err: Error | Response) => {
			if (err instanceof Error) {
				const cause = err.cause as {code?: string} | undefined;
				console.error(err.message, 'cause', cause?.code);

				return {
					status: 'error',
					error: err.message,
				};
			}
			const error = await err.json();
			console.log(error);
			return {
				status: 'error',
				error: error.details,
			};
		});
}
