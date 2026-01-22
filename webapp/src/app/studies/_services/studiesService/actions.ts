'use server';

import {deleteStudy} from '@/shared/services/studies';

import {revalidatePath} from 'next/cache';

export async function deleteStudyAction(id: string) {
	try {
		await deleteStudy(id);
		revalidatePath('/studies');
		return {success: true};
	} catch (error) {
		console.error(error);
		return {success: false, error: 'Failed to delete study'};
	}
}
