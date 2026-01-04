import {getOptions} from '@/shared/services/ai-inference';

import {StudyForm} from './_ui/StudyForm';

export default async function Page() {
	const options = await getOptions();

	return <StudyForm options={options} />;
}
