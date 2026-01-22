'use client';

import {routes} from '@/shared/routes';
import type {Study} from '@/shared/types/studies';

import {checkStudiesStatus} from '../../_services/studiesService';
import {deleteStudyAction} from '../../_services/studiesService/actions';
import {StatusLabel} from './components/StatusLabel';
import styles from './StudiesList.module.css';
import {Plus, TrashBin} from '@gravity-ui/icons';
import {Button, Flex, Icon, Table, Text, useToaster} from '@gravity-ui/uikit';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

type StudiesListProps = {
	studies: Study[];
};

export function StudiesList(props: StudiesListProps) {
	const {studies} = props;
	const router = useRouter();
	const {add} = useToaster();
	const [hoveredRow, setHoveredRow] = useState<string | null>(null);

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

	const handleDelete = async (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		const result = await deleteStudyAction(id);
		if (result.success) {
			add({
				name: 'delete-success',
				title: 'Исследование успешно удалено',
				theme: 'success',
				autoHiding: 2000,
			});
			router.refresh();
		} else {
			add({
				name: 'delete-error',
				title: 'Ошибка при удалении исследования',
				theme: 'danger',
				autoHiding: 2000,
			});
		}
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
					{id: 'actions', name: ''},
				]}
				data={studies.map((study) => ({
					id: study.id,
					name: study.filename,
					classLabel: study.classLabel,
					status: <StatusLabel status={study.status} />,
					date: new Date(study.createdAt).toLocaleString(),
					actions: (
						<div className={styles.actionsCell}>
							<Button
								view="flat"
								size="s"
								onClick={(e) => handleDelete(study.id, e)}
								title="Удалить исследование"
								className={`${styles.deleteButton} ${
									hoveredRow === study.id ? styles.visible : ''
								}`}
							>
								<Icon data={TrashBin} />
							</Button>
						</div>
					),
				}))}
				onRowClick={(row) => handleRowClick(row.id)}
				onRowMouseEnter={(row) => setHoveredRow(row.id)}
				onRowMouseLeave={() => setHoveredRow(null)}
				getRowDescriptor={() => ({interactive: true})}
			/>
		</Flex>
	);
}
