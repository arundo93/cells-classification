'use server';

import {createTask} from '@/shared/services/ai-inference';
import {
	createStudy,
	updateStudy,
	uploadStudyImage,
} from '@/shared/services/studies';

import {formSchema} from './schema';
import type {StudyForm} from './types';
import {type Schema, ValidationError} from 'yup';

export async function uploadStudy(
	study: StudyForm['studies'][number],
	models: StudyForm['models'],
) {
	const validationResult = safeValidate(formSchema, {
		studies: [study],
		models,
	});
	if (!validationResult.success) {
		return {success: false, error: validationResult.errors[0]};
	} else {
		const series = 'default';
		const filename = study.file.name;

		await uploadStudyImage(series, study.file);

		const id = await createStudy({
			...study,
			classLabel: study.classLabel ?? null,
			models: models.join(','),
			series,
			status: 'pending',
			filename,
		});

		const {status} = await createTask([{id, series, filename}], models);

		if (status === 'all') {
			await updateStudy(id, {
				status: 'processing',
			});
		}

		return {success: true};
	}
}

function safeValidate<T>(
	schema: Schema<T>,
	data: unknown,
): {success: true; data: T} | {success: false; errors: string[]} {
	try {
		const validatedData = schema.validateSync(data, {
			abortEarly: false,
		});
		return {success: true, data: validatedData};
	} catch (err) {
		if (err instanceof ValidationError) {
			const errors = err.inner.map((e) => e.message);
			return {success: false, errors};
		}
		return {success: false, errors: ['Непредвиденная ошибка валидации']};
	}
}
