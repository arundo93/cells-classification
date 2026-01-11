'use client';

import {routes} from '@/shared/routes';
import type {Study, StudyResult} from '@/shared/types/studies';

import {checkStudyHasResult} from '../../_services/studyDetails';
import styles from './StudyDetail.module.css';
import {toResultTable} from './toResultTable';
import {ArrowLeft} from '@gravity-ui/icons';
import {
	Button,
	Card,
	ClipboardButton,
	Flex,
	Icon,
	Label,
	Table,
	Text,
} from '@gravity-ui/uikit';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

type StudyDetailProps = {
	study: Study;
	rawResult?: StudyResult;
};

export function StudyDetail(props: StudyDetailProps) {
	const {study, rawResult} = props;
	const aiResult = toResultTable(rawResult?.results, study.classLabel);
	const router = useRouter();

	useEffect(() => {
		if (!aiResult) {
			// Set up polling every 5 seconds
			let timeoutId: NodeJS.Timeout | null = null;
			const checkStatus = () => {
				return setTimeout(async () => {
					const checkResult = await checkStudyHasResult(study);
					if (checkResult) {
						router.refresh();
					} else {
						timeoutId = checkStatus();
					}
				}, 5000);
			};
			timeoutId = checkStatus();

			// Clean up interval on component unmount
			return () => {
				timeoutId && clearTimeout(timeoutId);
			};
		}
	}, [aiResult, router.refresh, study]);

	return (
		<Flex
			direction="column"
			gap={8}
			width="100%"
			height="100vh"
			overflow="hidden"
		>
			<Flex direction="row" spacing={{px: 4, pt: 4}} gap={2}>
				<Button view="flat" href={routes.studies.url()}>
					<Icon data={ArrowLeft} />
				</Button>
				<Flex direction="column">
					<Text variant="header-2">Исследование</Text>
					<Text variant="body-1" color="secondary">
						{study.id}
					</Text>
				</Flex>
			</Flex>
			<Flex className={styles.container} gap={8} wrap spacing={{px: 4, pb: 4}}>
				<Flex direction="column" gap={8}>
					<Flex gap={4}>
						<Image
							className={styles.image}
							unoptimized
							alt={study.filename}
							width={512}
							height={512}
							src={routes.studyImage.url({id: study.id})}
						/>
					</Flex>
					<Flex direction="column" gap={2}>
						<Text variant="body-3">Результаты</Text>
						<Table
							columns={[
								{id: 'model', name: 'Модель', width: 100},
								{id: 'classLabel', name: 'Класс', width: 100},
								{id: 'predicted', name: 'Предсказанный класс', width: 100},
								{id: 'confidence', name: 'Вероятность', width: 100},
								{id: 'time', name: 'Время обработки', width: 100},
							]}
							data={(aiResult ?? []).map((row) => ({
								...row,
								predicted: (
									<Label
										theme={
											row.predicted === row.classLabel
												? 'success'
												: row.classLabel
													? 'warning'
													: 'unknown'
										}
									>
										{row.predicted}
									</Label>
								),
							}))}
						></Table>
					</Flex>
				</Flex>
				<Flex direction="column" gap={2} alignItems="flex-start">
					<Text variant="body-3">RAW</Text>
					<Card view="filled" spacing={{p: 4}} size="l">
						<Text className={styles.result} as="code" variant="code-1">
							<ClipboardButton
								className={styles.clipboard}
								text={JSON.stringify(rawResult)}
							/>
							{JSON.stringify(rawResult, null, 2)}
						</Text>
					</Card>
				</Flex>
			</Flex>
		</Flex>
	);
}
