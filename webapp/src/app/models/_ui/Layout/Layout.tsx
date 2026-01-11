'use client';

import {Flex, Text} from '@gravity-ui/uikit';

export function Layout(props: React.PropsWithChildren) {
	const {children} = props;

	return (
		<Flex direction="column" gap="4" width="100%" spacing={{p: 4}}>
			<Text variant="header-2">Модели классификации</Text>
			<Flex direction="row" wrap gap={4}>
				{children}
			</Flex>
		</Flex>
	);
}
