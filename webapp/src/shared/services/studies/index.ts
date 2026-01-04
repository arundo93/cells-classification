import {randomUUID} from 'node:crypto';
import {existsSync} from 'node:fs';
import {mkdir, readFile, stat, writeFile} from 'node:fs/promises';
import {join} from 'node:path';

import {config} from '../../config';
import {getDatabase} from '../../db';
import type {Study, StudyResult} from '../../types/studies';

// Create a new study
export async function createStudy(
	study: Omit<Study, 'id' | 'resultPath' | 'createdAt' | 'updatedAt'>,
): Promise<string> {
	const db = await getDatabase();
	const existingStudy = await getStudyByFilename(study.filename);
	if (existingStudy) {
		updateStudy(existingStudy.id, study);
		return existingStudy.id;
	}
	const id = randomUUID();

	await db.run(
		`INSERT INTO studies (id, series, filename, models, class_label, status) 
     VALUES (?, ?, ?, ?, ?, ?)`,
		[
			id,
			study.series,
			study.filename,
			study.models,
			study.classLabel,
			study.status,
		],
	);

	return id;
}

// Get all studies
export async function getAllStudies(): Promise<Study[]> {
	const db = await getDatabase();
	return await db.all(
		'SELECT id, series as series, filename as filename, models as models, class_label as classLabel, status, created_at as createdAt, updated_at as updatedAt FROM studies ORDER BY created_at DESC',
	);
}

// Get study by ID
export async function getStudyById(id: Study['id']): Promise<Study | null> {
	const db = await getDatabase();
	return await db.get(
		'SELECT id, series as series, filename as filename, models as models, class_label as classLabel, status, created_at as createdAt, updated_at as updatedAt FROM studies WHERE id = ?',
		[id],
	) ?? null;
}

// Get study by filename
export async function getStudyByFilename(
	filename: Study['filename'],
): Promise<Study | null> {
	const db = await getDatabase();
	return await db.get(
		'SELECT id, series as series, filename as filename, models as models, class_label as classLabel, status, created_at as createdAt, updated_at as updatedAt FROM studies WHERE filename = ?',
		[filename],
	) ?? null;
}

// Update study status
export async function updateStudy(
	id: Study['id'],
	study: Partial<
		Omit<Study, 'id' | 'series' | 'filename' | 'createdAt' | 'updatedAt'>
	>,
): Promise<void> {
	const {resultPath, models, classLabel, status} = study;
	const db = await getDatabase();
	await db.run(
		`UPDATE studies SET ${resultPath ? 'result_path = ?, ' : ''}${
			models ? 'models = ?, ' : ''
		}${classLabel ? 'class_label = ?, ' : ''}${
			status ? 'status = ?, ' : ''
		}updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
		[resultPath, models, classLabel, status, id].filter(Boolean),
	);
}

export async function deleteStudy(id: Study['id']): Promise<void> {
	const db = await getDatabase();
	await db.run('DELETE FROM studies WHERE id = ?', [id]);
}

export async function getStudyImage(id: Study['id']) {
	const study = await getStudyById(id);
	if (study) {
		const filePath = join(config.storageDir, study.series, study.filename);
		if (existsSync(filePath)) {
			return readFile(filePath);
		}
	}
	return null;
}

export async function uploadStudyImage(
	series: Study['series'],
	file: File,
): Promise<void> {
	// Create storage directory if it doesn't exist
	const storageDir = join(config.storageDir, series);
	try {
		await stat(storageDir);
	} catch {
		await mkdir(storageDir, {recursive: true});
	}

	// Save file to storage
	const filename = file.name;
	const filePath = join(storageDir, filename);

	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);
	await writeFile(filePath, buffer);
}

export function checkStudyResult(study: Study): {
	exists: boolean;
	resultPath: string;
} {
	const resultPath =
		study.resultPath ??
		join(
			config.storageDir,
			study.series,
			`${study.filename.replace(/\.[^/.]+$/, '')}_result.json`,
		);

	return {exists: existsSync(resultPath), resultPath};
}

export async function getStudyResult(id: Study['id']) {
	const study = await getStudyById(id);
	if (study) {
		const {exists, resultPath} = checkStudyResult(study);
		if (exists) {
			return JSON.parse(
				(await readFile(resultPath, {encoding: 'utf-8'})).toString(),
			) as StudyResult;
		}
	}
}
