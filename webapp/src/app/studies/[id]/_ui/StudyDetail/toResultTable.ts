import type {StudyResult} from '@/shared/types/studies';

export enum TableColumn {
	Model = 'model',
	classLabel = 'classLabel',
	Predicted = 'predicted',
	Confidence = 'confidence',
	Time = 'time',
}

export type ResultTable = Record<TableColumn, React.ReactNode>[] | undefined;

export function toResultTable(
	result?: StudyResult['results'],
	classLabel?: string | null,
): ResultTable {
	if (result) {
		return Object.entries(result).map(([model, modelResult]) => {
			const {
				predicted_class: predicted,
				confidence,
				time_end,
				time_start,
			} = modelResult;
			const time = toTime(new Date(time_start), new Date(time_end));
			return {
				model,
				classLabel,
				predicted,
				confidence,
				time,
			};
		});
	}
}

function toTime(start: Date, end: Date) {
	const delta = end.getMilliseconds() - start.getMilliseconds();
	if (delta > 1000) {
		return `${Math.floor(delta / 1000)} с`;
	}
	return `${delta} мс`;
}
