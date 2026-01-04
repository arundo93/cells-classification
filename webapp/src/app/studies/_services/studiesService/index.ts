'use server';

import {createTask} from '@/shared/services/ai-inference';
import {
	checkStudyResult,
	getAllStudies,
	updateStudy,
} from '@/shared/services/studies';

// Function to check and update study statuses
export async function checkStudiesStatus() {
	try {
		// Get all studies with pending or processing status
		const studies = await getAllStudies();
		const pendingStudies = studies.filter(
			(study) => study.status === 'pending' || study.status === 'error',
		);
		const processingStudies = studies.filter(
			(study) => study.status === 'processing',
		);

		for (const study of pendingStudies) {
			const {status} = await createTask([{...study}], study.models.split(','));
			if (status !== 'partial') {
				await updateStudy(study.id, {
					status: status === 'all' ? 'processing' : 'error',
				});
				if (status === 'error') {
					throw new Error('Error creating task');
				}
			}
		}

		// Check processing studies - see if results are available
		processingStudies.forEach(async (study) => {
			if (checkStudyResult(study).exists) {
				await updateStudy(study.id, {status: 'completed'});
			}
		});

		return {success: true};
	} catch {
		return {success: false};
	}
}
