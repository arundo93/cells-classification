export type Study = {
	id: string;
	series: string;
	filename: string;
	resultPath: string | null;
	models: string;
	classLabel: string | null;
	status: 'pending' | 'processing' | 'completed' | 'error';
	createdAt: string;
	updatedAt: string;
};

export type ClassName = string;

export type ModelName = string;

export type Probabilities = Record<ClassName, number>;

export type ModelPrediction = {
	predicted_class: ClassName;
	class_index: number;
	confidence: number;
	probabilities: Probabilities;
	time_start: string;
	time_end: string;
};

export type ModelError = {
	error: string;
};
