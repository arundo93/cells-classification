import type {Label} from '@gravity-ui/uikit';

export type CheckInferenceServiceStatus = {
	status: 'ok' | 'error';
	isFull?: boolean;
	tasksCount?: number;
};

export type Options = {
	models: string[];
	classLabels: string[];
};

export type ModelsInfo = {
	name: string;
	description: string;
	status: {
		text: string;
		theme: React.ComponentProps<typeof Label>['theme'];
	};
	characteristics: Record<string, string>;
}[];

export type TaskCreateResult = {
	status: 'all' | 'partial' | 'error';
};
