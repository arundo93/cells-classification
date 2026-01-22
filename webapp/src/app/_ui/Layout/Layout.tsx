'use client';

import {
	Flex,
	Toaster,
	ToasterComponent,
	ToasterProvider,
} from '@gravity-ui/uikit';

const toaster = new Toaster();

export function Layout(props: React.PropsWithChildren) {
	const {children} = props;

	return (
		<ToasterProvider toaster={toaster}>
			<Flex direction="row" width="100%" height="100vh">
				{children}
			</Flex>
			<ToasterComponent />
		</ToasterProvider>
	);
}
