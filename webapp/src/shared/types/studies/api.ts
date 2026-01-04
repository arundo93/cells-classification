import type {
	ModelError,
	ModelName,
	ModelPrediction,
	Study,
} from './definitions';

export type UploadSuccessResponse = {
	id: string;
};

export type UploadErrorResponse = {
	error: string;
};

export type StudiesListResponse = {
	studies: Study[];
};

export type StudiesListErrorResponse = {
	error: string;
};

export type StudyResult = {
	results: Record<ModelName, ModelPrediction>;
	errors: Record<ModelName, ModelError>;
};
