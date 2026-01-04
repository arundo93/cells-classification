import {getAllStudies} from '@/shared/services/studies';

import {StudiesList} from './_ui/StudiesList';

export default async function Page() {
	const studies = await getAllStudies();

	return <StudiesList studies={studies} />;
}
