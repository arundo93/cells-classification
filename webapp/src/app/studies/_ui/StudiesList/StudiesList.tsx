'use client';

import {routes} from '@/shared/routes';
import type {Study} from '@/shared/types/studies';

import {checkStudiesStatus} from '../../_services/studiesService';
import {StatusLabel} from './components/StatusLabel';
import {Plus} from '@gravity-ui/icons';
import {Button, Flex, Icon, Table, Text, useToaster} from '@gravity-ui/uikit';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

type StudiesListProps = {
	studies: Study[];
};

export function StudiesList(props: StudiesListProps) {
	const {studies} = props;
	const router = useRouter();
	const {add} = useToaster();

	useEffect(() => {
		// Set up polling every 2 seconds
		let timeoutId: NodeJS.Timeout | null = null;
		const checkStatus = () => {
			return setTimeout(async () => {
				const checkResult = await checkStudiesStatus();
				if (checkResult.success) {
					router.refresh();
				} else {
					add({
						name: 'polling-error',
						title: 'Ошибка при проверке статуса исследований',
						theme: 'warning',
						autoHiding: 2000,
					});
				}
				timeoutId = checkStatus();
			}, 5000);
		};
		timeoutId = checkStatus();

		// Clean up interval on component unmount
		return () => {
			timeoutId && clearTimeout(timeoutId);
		};
	}, [router.refresh, add]);

	const handleRowClick = (studyId: string) => {
		router.push(routes.study.url({id: studyId}));
	};

	return (
		<Flex direction="column" gap={4} spacing={{p: 4}} width="100%">
			<Flex
				direction="row"
				gap={2}
				justifyContent="space-between"
				alignItems="flex-start"
			>
				<Text variant="header-2">Исследования</Text>
				<Button view="action" size="m" href={routes.createStudy.url()}>
					<Icon data={Plus} />
					Новое исследование
				</Button>
			</Flex>
			<Table
				width="max"
				columns={[
					{id: 'id', name: 'ID'},
					{id: 'name', name: 'Название'},
					{id: 'classLabel', name: 'Метка класса'},
					{id: 'status', name: 'Статус'},
					{id: 'date', name: 'Дата'},
				]}
				data={studies.map((study) => ({
					id: study.id,
					name: study.filename,
					classLabel: study.classLabel,
					status: <StatusLabel status={study.status} />,
					date: new Date(study.createdAt).toLocaleString(),
				}))}
				onRowClick={(row) => handleRowClick(row.id)}
				getRowDescriptor={() => ({interactive: true})}
			/>
		</Flex>
	);
}
