import {getModelsInfo} from '@/shared/services/ai-inference';

import {Layout} from './_ui/Layout';
import {ModelCard} from './_ui/ModelCard';

export default async function Page() {
	const modelsInfo = await getModelsInfo();

	return (
		<Layout>
			{modelsInfo.map((model, index) => (
				<ModelCard key={index} {...model} />
			))}
		</Layout>
	);
}
