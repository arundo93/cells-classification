import type {StudyForm} from './types';
import * as yup from 'yup';

export const formSchema: yup.ObjectSchema<StudyForm> = yup.object({
	models: yup
		.array()
		.of(yup.string().required())
		.min(1, 'Выберите хотя бы одну модель')
		.required(),
	studies: yup
		.array()
		.of(
			yup.object({
				classLabel: yup.string().optional(),
				file: yup.mixed<File>().required('Файл обязателен'),
			}),
		)
		.min(1, 'Добавьте хотя бы одно исследование')
		.required(),
});
