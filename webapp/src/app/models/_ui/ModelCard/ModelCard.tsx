'use client';

import type {ModelsInfo} from '@/shared/services/ai-inference/types';

import styles from './ModelCard.module.css';
import {
	Card,
	Divider,
	DropdownMenu,
	Flex,
	Label,
	Text,
} from '@gravity-ui/uikit';

type ModelCardProps = ModelsInfo[number];

export function ModelCard(props: ModelCardProps) {
	const {name, description, status, characteristics} = props;

	return (
		<Card size="l" className={styles.card} spacing={{p: 4}}>
			<Flex direction="column" gap={2}>
				<Flex direction="column" gap={0}>
					<Flex
						direction="row"
						justifyContent="space-between"
						alignItems="center"
						gap={2}
					>
						<Text variant="body-2">{name}</Text>
						<Flex gap={1} alignItems="center">
							<Label theme={status.theme}>{status.text}</Label>
							<DropdownMenu items={[]}></DropdownMenu>
						</Flex>
					</Flex>
					<Text variant="caption-1">{description}</Text>
				</Flex>
				<Divider orientation="horizontal" />
				<Flex direction="row" gap={2} justifyContent="space-between">
					{Object.entries(characteristics).map(([title, value], index) => (
						<Flex key={index} gap={0.5} direction="column">
							<Text variant="caption-2">{title}</Text>
							<Text variant="body-short">{value}</Text>
						</Flex>
					))}
				</Flex>
			</Flex>
		</Card>
	);
}
