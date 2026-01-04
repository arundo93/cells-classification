'use server';

import {
	checkStudyResult,
	getStudyById,
	getStudyResult,
} from '@/shared/services/studies';
import type {Study} from '@/shared/types/studies';

export async function checkStudyHasResult(study: Study) {
	return checkStudyResult(study).exists;
}

export async function getStudyDetails(id: Study['id']) {
	const [study, aiResult] = await Promise.all([
		getStudyById(id),
		getStudyResult(id),
	]);

	return {
		study,
		rawResult: aiResult,
	};
}
