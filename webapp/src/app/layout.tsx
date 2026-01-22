import {getRootClassName} from '@gravity-ui/uikit/server';
import type {Metadata} from 'next';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';

import './globals.css';

import {getTheme} from '@/shared/lib';

import {Layout} from './_ui/Layout';
import {Navigation} from './_ui/Navigation';
import {ThemeSettingsProvider} from './_ui/ThemeSettingsProvider';

export const metadata: Metadata = {
	title: 'AI Models Dashboard',
	description: 'Work with AI models',
};

export default async function RootLayout({children}: React.PropsWithChildren) {
	const theme = await getTheme();

	return (
		<html lang="en">
			<body className={getRootClassName({theme})}>
				<ThemeSettingsProvider defaultTheme={theme}>
					<Layout>
						<Navigation />
						{children}
					</Layout>
				</ThemeSettingsProvider>
			</body>
		</html>
	);
}
