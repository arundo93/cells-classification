import styles from './Onboarding.module.css';
import {Flex, Text} from '@gravity-ui/uikit';

const allInstructions = [
	{
		id: 1,
		title: 'Создайте новое исследование',
		description:
			'Нажмите кнопку "Создать исследование" в меню слева, выберите изображение микроскопии клеток крови и отправьте его на анализ.',
	},
	{
		id: 2,
		title: 'Дождитесь завершения анализа',
		description:
			'Система автоматически обработает изображение и вернет результаты анализа. Это может занять несколько минут.',
	},
	{
		id: 3,
		title: 'Просмотрите результаты',
		description:
			'После завершения анализа вы сможете просмотреть размеченные клетки, JSON-результаты и текстовое заключение.',
	},
	{
		id: 4,
		title: 'Изучите детали',
		description:
			'Используйте интерактивный просмотрщик для детального анализа размеченных клеток и изучения их характеристик.',
	},
	{
		id: 5,
		title: 'Список исследований',
		description:
			'Используйте список для навигации между исследованиями, а также добавления и удаления исследований.',
	},
	{
		id: 6,
		title: 'Настройки',
		description: 'В настройках можно сменить цветовую схему сервиса',
	},
];

export function Onboarding() {
	return (
		<Flex direction="column" gap={8}>
			<Text style={{textAlign: 'center'}} variant="display-1">
				Добро пожаловать!
			</Text>
			<Text style={{textAlign: 'center'}} variant="header-1">
				Система автоматизированной классификации клеток крови
			</Text>
			<Text variant="body-3">
				Система автоматизированной классификации клеток крови позволяет получить
				информацию о типах клеток крови на изображениях микроскопии с
				применением технологий искусственного интеллекта
			</Text>
			<Flex direction="row" wrap>
				{allInstructions.map((instruction, index) => (
					<Flex
						direction="column"
						gap={2}
						className={styles.item}
						key={index}
						spacing={{p: 4, pl: 10}}
					>
						<Flex
							alignItems="center"
							justifyContent="center"
							className={styles.point}
						>
							<Text color="inverted-primary" variant="subheader-2">
								{instruction.id}
							</Text>
						</Flex>
						<Text variant="header-1">{instruction.title}</Text>
						<Text variant="body-2">{instruction.description}</Text>
					</Flex>
				))}
			</Flex>
		</Flex>
	);
}
