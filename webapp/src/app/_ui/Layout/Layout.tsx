'use client';

import {
	Flex,
	ThemeProvider,
	Toaster,
	ToasterComponent,
	ToasterProvider,
} from '@gravity-ui/uikit';

const toaster = new Toaster();

export function Layout(props: React.PropsWithChildren) {
	const {children} = props;

	return (
		<ThemeProvider theme="light">
			<ToasterProvider toaster={toaster}>
				<Flex direction="row" width="100%" height="100vh">
					{children}
				</Flex>
				<ToasterComponent />
			</ToasterProvider>
		</ThemeProvider>
	);
}
