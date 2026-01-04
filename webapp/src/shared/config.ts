'server-only';

import {join} from 'node:path';

export const config = {
	storageDir: join(process.cwd(), '..', 'storage', 'studies'),
	databaseDir: join(process.cwd(), 'storage', 'studies.db'),
	aiInference: {
		host: 'http://localhost:8000',
	},
};
