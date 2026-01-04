import type {Study} from '@/shared/types/studies';

import {Label} from '@gravity-ui/uikit';

type StatusLabelProps = {
	status: Study['status'];
};

function toLabel(status: Study['status']): {
	theme: React.ComponentProps<typeof Label>['theme'];
	label: string;
} {
	switch (status) {
		case 'pending':
			return {theme: 'unknown', label: 'Ожидает'};
		case 'processing':
			return {theme: 'warning', label: 'Обрабатывается'};
		case 'completed':
			return {theme: 'success', label: 'Завершено'};
		case 'error':
			return {theme: 'danger', label: 'Ошибка'};
		default:
			return {theme: 'unknown', label: 'Неизвестно'};
	}
}

export function StatusLabel(props: StatusLabelProps) {
	const {status} = props;
	const {theme, label} = toLabel(status);

	return <Label theme={theme}>{label} </Label>;
}
