'use client';

import {routes} from '@/shared/routes';

import styles from './Navigation.module.css';
import {BranchesDown, Flask, Gear, Molecule, Plus} from '@gravity-ui/icons';
import {AsideHeader} from '@gravity-ui/navigation';
import {usePathname} from 'next/navigation';
import {useState} from 'react';

export function Navigation() {
	const pathname = usePathname();
	const [compact, setCompact] = useState(false);

	return (
		<div className={styles.container}>
			<AsideHeader
				logo={{text: 'BCC', icon: Molecule}}
				menuItems={[
					{
						id: '0',
						title: 'Модели',
						icon: BranchesDown,
						href: routes.models.url(),
						current: pathname === routes.models.url(),
					},
					{
						id: '1',
						title: 'Исследования',
						icon: Flask,
						href: routes.studies.url(),
						current: pathname === routes.studies.url(),
					},
					{
						id: '1',
						title: 'Настройки',
						icon: Gear,
						href: routes.settings.url(),
						current: pathname === routes.settings.url(),
					},
					{
						id: '3',
						title: 'Новое исследование',
						icon: Plus,
						type: 'action',
						href: routes.createStudy.url(),
					},
				]}
				compact={compact}
				onChangeCompact={setCompact}
				expandTitle="Развернуть"
				collapseTitle="Свернуть"
			/>
		</div>
	);
}
