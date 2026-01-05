'use client';

import {routes} from '@/shared/routes';

import {checkStatus, uploadStudy} from '../../_services/formService';
import {formSchema} from '../../_services/formService/schema';
import type {StudyForm as StudyFormType} from '../../_services/formService/types';
import styles from './StudyForm.module.css';
import {Plus, TrashBin} from '@gravity-ui/icons';
import {
	Box,
	Button,
	Card,
	FilePreview,
	Flex,
	Icon,
	Select,
	Text,
	useToaster,
} from '@gravity-ui/uikit';
import {yupResolver} from '@hookform/resolvers/yup';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';

type StudyFormProps = {
	options: {
		models: string[];
		classLabels: string[];
	};
};

export function StudyForm({options}: StudyFormProps) {
	const {models, classLabels} = options;
	const router = useRouter();
	const {add} = useToaster();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: {defaultValues, errors, isSubmitting},
		reset,
	} = useForm<StudyFormType>({
		resolver: yupResolver(formSchema),
		defaultValues: {
			models: options.models,
			studies: [],
		},
	});

	const studies = watch('studies');

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files ?? []);
		const filenames = new Set(files.map((file) => file.name));
		if (files) {
			const newStudies = [
				...studies.filter((study) => !filenames.has(study.file.name)),
				...files.values().map((file) => ({
					file,
				})),
			];
			setValue('studies', newStudies, {shouldValidate: true});
		}
	};

	const removeStudyField = (index: number) => {
		if (studies.length <= 1) return;
		const newStudies = studies.filter((_, i) => i !== index);
		setValue('studies', newStudies, {shouldValidate: true});
	};

	const onSubmit = async (data: StudyFormType) => {
		const {models, studies} = data;
		const serviceStatus = await checkStatus();
		if (serviceStatus) {
			for (const study of studies) {
				const result = await uploadStudy(study, models);
				if (!result.success) {
					add({
						name: 'upload-study-error',
						title: `Ошибка при загрузке файла ${study.file.name}`,
						theme: 'danger',
					});
				}
			}
			reset();
			router.push(routes.studies.url());
		} else {
			add({
				name: 'upload-study-info',
				title: `Сервис недоступен. Попробуйте позже`,
				theme: 'info',
			});
		}
	};

	return (
		<Flex direction="column" gap={4} spacing={{p: 4}} width="100%">
			<Text variant="header-2">Новое исследование</Text>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={2}>
					<Box>
						<Select
							width="auto"
							placeholder="Выберите модель"
							value={watch('models')}
							onUpdate={(value) => {
								setValue('models', value, {shouldValidate: true});
							}}
							defaultValue={
								defaultValues?.models?.filter(
									(option) => typeof option === 'string',
								) ?? []
							}
							multiple
							options={models.map((m) => ({value: m, content: m}))}
							errorMessage={errors.models?.message}
							errorPlacement="outside"
							validationState={errors.models?.message ? 'invalid' : undefined}
							disabled={isSubmitting}
						/>
					</Box>
					<Flex direction="row" gap={2} wrap>
						{studies.map((study, index) => (
							<Card
								key={study.file.name}
								spacing={{py: 3, px: 1}}
								position="relative"
							>
								<Box className={styles.actions}>
									<Button
										view="normal-contrast"
										pin="circle-circle"
										onClick={() => removeStudyField(index)}
										disabled={studies.length <= 1 || isSubmitting}
									>
										<Icon
											data={TrashBin}
											color={studies.length <= 1 ? 'secondary' : 'danger'}
										/>
									</Button>
								</Box>
								<Flex key={index} direction="column" gap={1}>
									<Flex direction="column" gap={1}>
										<FilePreview file={study.file} />
										{errors.studies?.[index]?.file && (
											<Text color="danger">
												{errors.studies[index].file.message}
											</Text>
										)}
									</Flex>
									<Box spacing={{px: 3}} maxWidth={120}>
										<Select
											width="max"
											{...register(`studies.${index}.classLabel`)}
											options={classLabels.map((label) => ({
												value: label,
												content: label,
											}))}
											onUpdate={(values) => {
												setValue(`studies.${index}.classLabel`, values[0], {
													shouldValidate: true,
												});
											}}
											errorMessage={
												errors.studies?.[index]?.classLabel?.message
											}
											disabled={isSubmitting}
										/>
									</Box>
								</Flex>
							</Card>
						))}
						<Card spacing={{p: 4}}>
							<label htmlFor="files">
								<Flex
									direction="column"
									gap={2}
									justifyContent="center"
									alignItems="center"
									height="100%"
								>
									<Icon data={Plus} size={40} color="secondary" />
									<Text variant="body-1">Добавить файлы</Text>
								</Flex>
							</label>
							<input
								hidden
								id="files"
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								disabled={isSubmitting}
								multiple
							/>
						</Card>
					</Flex>
					{errors.studies?.message && (
						<Text color="danger">{errors.studies.message}</Text>
					)}
					<Flex direction="row" gap={2}>
						<Button
							type="submit"
							view="action"
							size="m"
							loading={isSubmitting}
							disabled={isSubmitting}
						>
							<Icon data={Plus} />
							Создать исследования
						</Button>
						<Button
							type="button"
							view="outlined"
							size="m"
							onClick={() => router.push(routes.studies.url())}
							disabled={isSubmitting}
						>
							Отмена
						</Button>
					</Flex>
				</Flex>
			</form>
		</Flex>
	);
}
