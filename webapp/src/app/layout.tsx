import type {Metadata} from 'next';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';

import './globals.css';

import {Layout} from './_ui/Layout';
import {Navigation} from './_ui/Navigation';

export const metadata: Metadata = {
	title: 'AI Models Dashboard',
	description: 'Work with AI models',
};

export default function RootLayout({children}: React.PropsWithChildren) {
	return (
		<html lang="en">
			<body>
				<Layout>
					<Navigation />
					{children}
				</Layout>
			</body>
		</html>
	);
}
