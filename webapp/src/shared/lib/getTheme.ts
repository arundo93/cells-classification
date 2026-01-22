import type {Theme} from '@gravity-ui/uikit';
import {cookies} from 'next/headers';

export const themeCookie = 'THEME';

function checkTheme(theme: string): theme is Theme {
	return ['system', 'light', 'light-hc', 'dark', 'dark-hc'].includes(theme);
}

export async function getTheme(): Promise<Theme> {
	const theme = await cookies().then(
		(reqCookies) => reqCookies.get(themeCookie)?.value ?? '',
	);

	return checkTheme(theme) ? theme : 'system';
}
