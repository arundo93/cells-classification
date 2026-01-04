type FormStudyItem = {
	classLabel?: string;
	file: File;
};

export type StudyForm = {
	models: string[];
	studies: FormStudyItem[];
};

export type UploadResponse = {
	success: boolean;
	error?: string;
};
