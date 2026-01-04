'use client';

import {ModelCard} from './_ui/ModelCard';
import {Flex, type Label, Text} from '@gravity-ui/uikit';

export type Model = {
	name: string;
	description: string;
	status: {
		code: React.ComponentProps<typeof Label>['theme'];
		text: string;
	};
	characteristics: Record<'title' | 'value', string>[];
};

export default function ModelsPage() {
	const mockModels: Model[] = [
		{
			name: 'GPT-4 Transformer',
			description: 'Large language model for text generation and understanding',
			status: {
				code: 'success',
				text: 'Активная',
			},
			characteristics: [
				{
					title: 'Параметров',
					value: '31M',
				},
				{
					title: 'Версия',
					value: '4.1.0',
				},
				{
					title: 'Обновлена',
					value: '2023-01-15',
				},
			],
		},
		{
			name: 'ResNet-50 Image Classifier',
			description: 'Deep convolutional neural network for image classification',
			status: {
				code: 'success',
				text: 'Активная',
			},
			characteristics: [
				{
					title: 'Параметров',
					value: '120K',
				},
				{
					title: 'Версия',
					value: '2.3.1',
				},
				{
					title: 'Обновлена',
					value: '2023-02-20',
				},
			],
		},
		{
			name: 'BERT NLP Encoder',
			description: 'Bidirectional encoder representations for NLP tasks',
			status: {
				code: 'success',
				text: 'Активная',
			},
			characteristics: [
				{
					title: 'Параметров',
					value: '1M',
				},
				{
					title: 'Версия',
					value: '1.5.2',
				},
				{
					title: 'Обновлена',
					value: '2023-03-10',
				},
			],
		},
	];

	return (
		<Flex direction="column" gap="4" width="100%" spacing={{p: 4}}>
			<Text variant="header-2">Модели классификации</Text>
			<Flex direction="row" wrap gap={4}>
				{mockModels.map((model, index) => (
					<ModelCard key={index} {...model} />
				))}
			</Flex>
		</Flex>
	);
}
