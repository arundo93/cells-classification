'use client';

import {useThemeSettingsContext} from '../_ui/ThemeSettingsProvider';
import {updateTheme} from './_services';
import {Flex, Switch, Text, useThemeValue} from '@gravity-ui/uikit';
import {useTransition} from 'react';

export default function Page() {
	const [loading, startTransition] = useTransition();
	const theme = useThemeValue();
	const {setTheme} = useThemeSettingsContext();

	const handleThemeUpdate = (checked: boolean) => {
		const newTheme = checked ? 'light' : 'dark';
		startTransition(async () => {
			const result = await updateTheme(newTheme);
			if (result) {
				setTheme(newTheme);
			}
		});
	};

	return (
		<Flex direction="column" gap={8} width="100%" spacing={{p: 4}}>
			<Text variant="header-2">Настройки</Text>
			<Flex direction="column" gap={4}>
				<Text variant="body-3">Тема</Text>
				<Flex gap={2}>
					<Text variant="body-2">Темная</Text>
					<Switch
						size="m"
						loading={loading}
						checked={theme === 'light'}
						onUpdate={handleThemeUpdate}
					/>
					<Text variant="body-2">Светлая</Text>
				</Flex>
			</Flex>
		</Flex>
	);
}
