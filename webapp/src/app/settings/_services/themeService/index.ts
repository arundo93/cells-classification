'use server';

import {themeCookie} from '@/shared/lib';

import type {Theme} from '@gravity-ui/uikit';
import {cookies} from 'next/headers';

export async function updateTheme(theme: Theme) {
	return await cookies()
		.then((reqCookies) => reqCookies.set(themeCookie, theme))
		.then(() => true)
		.catch(() => false);
}
