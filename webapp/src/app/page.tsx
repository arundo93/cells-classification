'use client';

import {Onboarding} from './_ui/Onboarding';
import {Flex} from '@gravity-ui/uikit';

export default function HomePage() {
	return (
		<Flex direction="row" gap="4" width="100%" spacing={{p: 4}}>
			<Onboarding />
		</Flex>
	);
}
